import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(
  import.meta.env.GEMINI_API_KEY || "AIzaSyDgWWiHWub0wyPQP6NX_fnN7qi8OTQF3Eg"
);

// Indonesian news sites configuration
const INDONESIA_NEWS_SITES = {
  Kompas: {
    base_url: "https://www.kompas.com",
    search_url: "https://search.kompas.com/search?q=",
    article_selector: ".article-link",
    title_selector: ".article-link .articleTitle",
    content_selector: ".articleLead p",
  },
  // Detik: {
  //   base_url: "https://www.detik.com",
  //   search_url: "https://www.detik.com/search/searchall?query=",
  //   article_selector: ".media__title a",
  //   title_selector: ".media__title",
  //   content_selector: ".media__desc",
  // },
  // AntaraNews: {
  //   base_url: "https://www.antaranews.com",
  //   search_url: "https://www.antaranews.com/search?q=",
  //   article_selector: ".card__post__content .card__post__title h2 a",
  //   title_selector: ".card__post__content .card__post__title h2 a",
  //   content_selector: ".card__post__content p",
  // },
};

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
];

// Define types for our analysis result
interface AnalysisResult {
  query: string;
  status: "SUCCESS" | "NO_ARTICLES_FOUND" | "SEARCH_ERROR" | "ERROR";
  analysis: string;
  searchResults: any[] | null;
  timestamp?: string;
  sourceCount?: number;
  sources?: string[];
}

interface Article {
  title: string;
  url: string;
  source: string;
  content?: string;
  scraped_at?: string;
}

interface SiteInfo {
  base_url: string;
  search_url: string;
  article_selector: string;
  title_selector: string;
  content_selector: string;
}

// CORS proxy options with fallbacks
const CORS_PROXIES = ["https://polar-spire-53886-ed802abdbc58.herokuapp.com/"];

/**
 * Get a random user agent
 */
function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Add delay between requests
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simple DOM parser for browser environment
 */
function parseHTML(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, "text/html");
}

/**
 * Fetch with multiple proxy fallbacks and retry logic
 */
async function fetchWithProxy(
  url: string,
  headers: HeadersInit = {},
  maxRetries: number = 2
): Promise<string> {
  const errors: string[] = [];

  // Try each CORS proxy with retry logic
  for (const [index, proxy] of CORS_PROXIES.entries()) {
    for (let retry = 0; retry <= maxRetries; retry++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        console.log(
          `📡 Trying proxy ${index + 1}${
            retry > 0 ? ` (retry ${retry})` : ""
          }: ${proxy}`
        );

        const fetchOptions: RequestInit = {
          headers: {
            ...headers,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "id,en-US;q=0.7,en;q=0.3",
            "Cache-Control": "no-cache",
          },
          signal: controller.signal,
        };

        let proxyUrl: string;
        let response: Response;

        if (proxy.includes("allorigins.win")) {
          proxyUrl = proxy + encodeURIComponent(url);
          response = await fetch(proxyUrl, fetchOptions);

          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Proxy ${index + 1} successful (allorigins)`);
            return data.contents || "";
          } else {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
        } else if (proxy.includes("thingproxy.freeboard.io")) {
          proxyUrl = proxy + encodeURIComponent(url);
          response = await fetch(proxyUrl, fetchOptions);

          if (response.ok) {
            const text = await response.text();
            console.log(`✅ Proxy ${index + 1} successful (thingproxy)`);
            return text;
          } else {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
        } else {
          proxyUrl = proxy + url;
          response = await fetch(proxyUrl, fetchOptions);

          if (response.ok) {
            const text = await response.text();
            console.log(`✅ Proxy ${index + 1} successful`);
            return text;
          } else {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
        }
      } catch (error) {
        const errorMsg = `Proxy ${index + 1}${
          retry > 0 ? ` (retry ${retry})` : ""
        } failed: ${error instanceof Error ? error.message : "Unknown error"}`;
        console.warn(`❌ ${errorMsg}`);

        if (retry === maxRetries) {
          errors.push(errorMsg);
        } else {
          // Wait before retry
          await delay(1000);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }
  }

  // If all proxies fail, log detailed errors but DON'T use mock content per user request
  console.error(`❌ All proxies failed for ${url}. Errors:`, errors);

  // Throw error instead of returning mock content
  throw new Error(
    `Failed to fetch ${url} after trying all proxies: ${errors.join("; ")}`
  );
}

/**
 * Search for news articles on a specific site
 */
async function searchNewsSite(
  siteName: string,
  siteInfo: SiteInfo,
  query: string,
  maxResults: number = 5
): Promise<Article[]> {
  try {
    const headers = { "User-Agent": getRandomUserAgent() };
    const searchUrl = siteInfo.search_url + encodeURIComponent(query);

    console.log(`Searching ${siteName}...`);

    const html = await fetchWithProxy(searchUrl, headers);

    const doc = parseHTML(html);
    const articles: Article[] = [];

    // Find article links
    const articleLinks = doc.querySelectorAll(siteInfo.article_selector);

    for (let i = 0; i < Math.min(articleLinks.length, maxResults); i++) {
      const link = articleLinks[i] as HTMLElement;
      const href = link.getAttribute("href");

      if (href) {
        // Convert relative URLs to absolute
        const fullUrl = href.startsWith("/") ? siteInfo.base_url + href : href;

        // Get title
        let title = "No title";
        const titleElem = link.querySelector(siteInfo.title_selector);

        if (titleElem) {
          title = titleElem.textContent?.trim() || "No title";
        } else if (siteName === "Detik") {
          title = link.getAttribute("dtr-ttl") || "No title";
        } else if (siteName === "AntaraNews") {
          title = link.getAttribute("title") || "No title";
        }

        articles.push({
          title: title,
          url: fullUrl,
          source: siteName,
        });
      }
    }

    return articles;
  } catch (error) {
    console.error(`Error searching ${siteName}:`, error);
    // Don't return mock articles, let the error propagate up
    throw new Error(
      `Failed to search ${siteName}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Scrape article content from URL
 */
async function scrapeArticleContent(
  url: string,
  contentSelector: string
): Promise<string> {
  try {
    const headers = { "User-Agent": getRandomUserAgent() };

    const html = await fetchWithProxy(url, headers);

    const doc = parseHTML(html);

    // Try the specific content selector first
    let contentElem = doc.querySelector(contentSelector);

    // If specific selector fails, try common content areas
    if (!contentElem) {
      const fallbackSelectors = [
        "article",
        ".article-content",
        ".post-content",
        ".content",
        '[class*="content"]',
      ];
      for (const selector of fallbackSelectors) {
        contentElem = doc.querySelector(selector);
        if (contentElem) break;
      }
    }

    if (contentElem) {
      // Remove unwanted elements
      const unwantedSelectors = [
        "script",
        "style",
        "nav",
        "header",
        "footer",
        ".ads",
        ".advertisement",
      ];
      unwantedSelectors.forEach((selector) => {
        const elements = contentElem!.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
      });

      // Get all paragraphs
      const paragraphs = contentElem.querySelectorAll("p");
      const content = Array.from(paragraphs)
        .map((p) => p.textContent?.trim() || "")
        .filter((text) => text.length > 0)
        .join("\n");

      if (content && content.length > 50) {
        return content.substring(0, 2000); // Limit content length
      }
    }

    // Fallback: get all text
    const allText = doc.body?.textContent || "";
    const lines = allText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const content = lines.join(" ");

    if (content && content.length > 50) {
      return content.substring(0, 2000); // Limit content length
    }

    // If still no content, throw error
    throw new Error("No content found in article");
  } catch (error) {
    throw new Error(
      `Error scraping content from ${url}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Search all Indonesian news sites
 */
async function searchAllNewsSites(
  query: string,
  maxResultsPerSite: number = 3
): Promise<Article[]> {
  const allArticles: Article[] = [];
  const errors: string[] = [];

  console.log(`🔍 Searching for: '${query}'`);
  console.log("=".repeat(60));

  for (const [siteName, siteInfo] of Object.entries(INDONESIA_NEWS_SITES)) {
    try {
      const articles = await searchNewsSite(
        siteName,
        siteInfo,
        query,
        maxResultsPerSite
      );
      allArticles.push(...articles);
      console.log(`✅ ${siteName}: Found ${articles.length} articles`);
    } catch (error) {
      const errorMsg = `${siteName}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      errors.push(errorMsg);
      console.warn(`❌ ${errorMsg}`);
    }
    // await delay(1000); // Be polite between requests
  }

  if (allArticles.length === 0 && errors.length > 0) {
    throw new Error(`All news sites failed: ${errors.join("; ")}`);
  }

  return allArticles;
}

/**
 * Scrape content for all articles
 */
async function scrapeArticlesContent(articles: Article[]): Promise<Article[]> {
  const results: Article[] = [];

  console.log(`\n📄 Scraping content from ${articles.length} articles...`);
  console.log("=".repeat(60));

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(
      `Scraping ${i + 1}/${articles.length}: ${
        article.source
      } - ${article.title.substring(0, 50)}...`
    );

    try {
      const siteInfo =
        INDONESIA_NEWS_SITES[
          article.source as keyof typeof INDONESIA_NEWS_SITES
        ];
      const content = await scrapeArticleContent(
        article.url,
        siteInfo.content_selector
      );

      article.content = content;
      article.scraped_at = new Date().toISOString();
      results.push(article);
      console.log(`✅ Successfully scraped content`);
    } catch (error) {
      console.warn(
        `❌ Failed to scrape content: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      // Skip articles that fail to scrape
      continue;
    }

    // await delay(1000); // Be polite between requests
  }

  return results;
}

/**
 * Search function equivalent to Python version
 */
async function search(query: string): Promise<Article[] | string> {
  try {
    // Step 1: Search all news sites
    const articles = await searchAllNewsSites(query, 1);

    if (articles.length === 0) {
      return "NOT FOUND";
    }

    console.log(
      `✅ Found ${articles.length} articles, proceeding to scrape content...`
    );

    // Step 2: Scrape content from all articles
    const results = await scrapeArticlesContent(articles);

    // Return results even if some articles failed to scrape
    if (results.length === 0) {
      return "NOT FOUND";
    }

    console.log(`✅ Successfully scraped ${results.length} articles`);
    return results;
  } catch (error) {
    console.error("Search error:", error);
    return "ERROR";
  }
}

/**
 * Format search results for Gemini analysis
 */
function formatResultsForGemini(results: Article[], query: string): string {
  if (!results || results.length === 0) {
    return `Tidak ditemukan artikel berita yang reliabel untuk query: "${query}". Tidak dapat memverifikasi informasi.`;
  }

  let context = `Hasil Pencarian Berita untuk "${query}":\n\n`;

  results.forEach((result, index) => {
    context += `--- Artikel ${index + 1} ---\n`;
    context += `Sumber: ${result.source}\n`;
    context += `Judul: ${result.title}\n`;
    context += `URL: ${result.url}\n`;
    if (result.content) {
      // Limit content length for Gemini
      const content = result.content.substring(0, 1500);
      context += `Konten: ${content}\n`;
    }
    context += `Diambil: ${result.scraped_at}\n\n`;
  });

  return context;
}

/**
 * Analyze with Gemini AI
 */
async function analyzeWithGemini(
  query: string,
  searchResults: Article[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const newsContext = formatResultsForGemini(searchResults, query);

    const prompt = `
Anda adalah asisten AI fact-checking untuk aplikasi NoFake. Tugas Anda adalah menganalisis informasi berita dan memberikan fact-checking yang akurat dan tidak bias.

Pertanyaan User: "${query}"

Konteks Berita dari sumber Indonesia (Kompas, Detik, AntaraNews):
${newsContext}

Mohon berikan analisis komprehensif yang mencakup:

1. **Ringkasan Fact Check**: Apakah informasi dalam pertanyaan akurat, sebagian akurat, salah, atau tidak dapat diverifikasi?

2. **Analisis Bukti**: Bukti apa yang mendukung atau membantah klaim tersebut? Rujuk artikel dan sumber spesifik.

3. **Kredibilitas Sumber**: Nilai keandalan sumber yang ditemukan.

4. **Konteks & Latar Belakang**: Berikan informasi latar belakang yang relevan untuk memahami topik.

5. **Kesimpulan**: Kesimpulan faktual yang jelas dengan tingkat kepercayaan (Tinggi/Sedang/Rendah).

6. **Rekomendasi**: Langkah verifikasi tambahan apa yang akan membantu?

Mohon respon dalam bahasa Indonesia, bersikap objektif, dan hindari spekulasi. Jika informasi tidak cukup, nyatakan dengan jelas.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return `Error saat analisis AI: ${
      error instanceof Error ? error.message : "Unknown error"
    }. Silakan coba lagi atau verifikasi informasi secara manual.`;
  }
}

/**
 * Main function to search and analyze news with Gemini
 */
export async function searchAndAnalyze(query: string): Promise<AnalysisResult> {
  try {
    console.log(`🚀 Starting fact-check analysis for: "${query}"\n`);

    // Step 1: Search for news articles using real web scraping
    console.log("🔍 Phase 1: Searching Indonesian news sources...");
    const searchResults = await search(query);

    if (searchResults === "NOT FOUND") {
      console.log("❌ No articles found for the query");
      return {
        query: query,
        status: "NO_ARTICLES_FOUND",
        analysis:
          "Tidak ditemukan artikel berita yang relevan untuk memverifikasi informasi ini. Silakan coba dengan kata kunci yang berbeda atau periksa sumber lain.",
        searchResults: null,
      };
    }

    if (searchResults === "ERROR") {
      console.log("❌ Error occurred during search");
      return {
        query: query,
        status: "SEARCH_ERROR",
        analysis:
          "Terjadi kesalahan saat mencari informasi. Silakan coba lagi nanti.",
        searchResults: null,
      };
    }

    const articles = searchResults as Article[];

    if (!articles || articles.length === 0) {
      console.log("❌ No articles found for the query");
      return {
        query: query,
        status: "NO_ARTICLES_FOUND",
        analysis:
          "Tidak ditemukan artikel berita yang relevan untuk memverifikasi informasi ini. Silakan coba dengan kata kunci yang berbeda atau periksa sumber lain.",
        searchResults: null,
      };
    }

    console.log(
      `✅ Found ${articles.length} articles from Indonesian news sources`
    );

    // Step 2: Analyze with Gemini AI
    console.log("\n🤖 Phase 2: Analyzing with Gemini AI...");
    const analysis = await analyzeWithGemini(query, articles);

    console.log("✅ Analysis completed\n");

    return {
      query: query,
      status: "SUCCESS",
      analysis: analysis,
      searchResults: articles,
      timestamp: new Date().toISOString(),
      sourceCount: articles.length,
      sources: [...new Set(articles.map((r: Article) => r.source))],
    };
  } catch (error) {
    console.error("Error in searchAndAnalyze:", error);
    return {
      query: query,
      status: "ERROR",
      analysis: `Terjadi kesalahan sistem: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      searchResults: null,
    };
  }
}

/**
 * Generate a concise chat title from the user's query using Gemini
 */
export async function generateChatTitle(query: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Berikan judul singkat untuk percakapan berdasarkan pertanyaan berikut: "${query}"

PENTING:
- Maksimal 50 karakter
- Ringkas dan jelas
- Tangkap inti topik
- Dalam bahasa Indonesia
- HANYA berikan judulnya, tanpa tanda kutip atau penjelasan tambahan

Contoh:
User: "Apakah benar presiden jokowi akan memperpanjang masa jabatan?"
Title: Jokowi Perpanjang Masa Jabatan

User: "Benarkah vaksin covid menyebabkan autisme?"
Title: Vaksin COVID dan Autisme

Sekarang berikan judul untuk: "${query}"
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let title = response.text().trim();

    // Remove quotes if present
    title = title.replace(/^["']|["']$/g, "");

    // Limit to 50 characters and add ellipsis if needed
    if (title.length > 50) {
      title = title.substring(0, 47) + "...";
    }

    return title || "Obrolan Baru";
  } catch (error) {
    console.error("Error generating chat title:", error);
    // Return first 50 chars of query as fallback
    return query.length > 50 ? query.substring(0, 47) + "..." : query;
  }
}

/**
 * Interface for conversation context
 */
export interface ConversationContext {
  role: "user" | "assistant";
  message: string;
}

/**
 * Classify user intent: whether they want to verify information or ask about previous responses
 */
async function classifyUserIntent(
  query: string,
  conversationHistory: ConversationContext[]
): Promise<"VERIFY_INFORMATION" | "FOLLOWUP_QUESTION"> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const historyText =
      conversationHistory.length > 0
        ? conversationHistory
            .map(
              (ctx) =>
                `${ctx.role === "user" ? "User" : "Assistant"}: ${ctx.message}`
            )
            .join("\n")
        : "No previous conversation";

    const prompt = `
Kamu adalah classifier yang menentukan intent dari pertanyaan user dalam context fact-checking app.

Ada 2 kategori intent:
1. VERIFY_INFORMATION - User ingin memverifikasi informasi/berita baru (perlu web scraping)
2. FOLLOWUP_QUESTION - User bertanya tentang response sebelumnya (tidak perlu web scraping)

Riwayat Percakapan:
${historyText}

Pertanyaan User Saat Ini: "${query}"

Analisis:
- Jika user menanyakan informasi/berita BARU yang belum pernah dibahas, jawab: VERIFY_INFORMATION
- Jika user bertanya tentang penjelasan lebih lanjut, detail, atau klarifikasi dari response sebelumnya, jawab: FOLLOWUP_QUESTION
- Jika user menggunakan kata-kata seperti "maksudnya", "jelaskan lebih lanjut", "apa itu", "bagaimana bisa", "kenapa", jawab: FOLLOWUP_QUESTION
- Jika tidak ada riwayat percakapan, jawab: VERIFY_INFORMATION

Jawab HANYA dengan: VERIFY_INFORMATION atau FOLLOWUP_QUESTION
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const intent = response.text().trim();

    console.log(`🎯 Intent classified: ${intent}`);

    if (intent.includes("FOLLOWUP_QUESTION")) {
      return "FOLLOWUP_QUESTION";
    }
    return "VERIFY_INFORMATION";
  } catch (error) {
    console.error("Error classifying intent:", error);
    // Default to verify information if classification fails
    return "VERIFY_INFORMATION";
  }
}

/**
 * Answer follow-up questions based on conversation context
 */
async function answerFollowUpQuestion(
  query: string,
  conversationHistory: ConversationContext[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const historyText = conversationHistory
      .map(
        (ctx) => `${ctx.role === "user" ? "User" : "Assistant"}: ${ctx.message}`
      )
      .join("\n\n");

    const prompt = `
Anda adalah asisten AI fact-checking untuk aplikasi NoFake. User sedang bertanya tentang response sebelumnya.

Riwayat Percakapan:
${historyText}

Pertanyaan User Saat Ini: "${query}"

Instruksi:
1. Jawab pertanyaan user berdasarkan context percakapan sebelumnya
2. Berikan penjelasan yang jelas dan detail
3. Jika perlu, rujuk ke informasi yang sudah dijelaskan sebelumnya
4. Tetap objektif dan faktual
5. Gunakan bahasa Indonesia yang baik
6. Jika pertanyaan tidak bisa dijawab dari context sebelumnya, katakan dengan jelas

Mohon berikan jawaban yang informatif dan membantu:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error answering follow-up question:", error);
    return `Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Error: ${
      error instanceof Error ? error.message : "Unknown error"
    }. Silakan coba lagi.`;
  }
}

/**
 * Main function to search and analyze news with Gemini (STATEFUL VERSION)
 * Now includes conversation context for follow-up questions
 */
export async function searchAndAnalyzeStateful(
  query: string,
  conversationHistory: ConversationContext[] = []
): Promise<AnalysisResult> {
  try {
    console.log(`🚀 Starting stateful fact-check analysis for: "${query}"\n`);

    // Step 1: Classify user intent
    console.log("🎯 Phase 1: Classifying user intent...");
    const intent = await classifyUserIntent(query, conversationHistory);

    if (intent === "FOLLOWUP_QUESTION" && conversationHistory.length > 0) {
      // User is asking about previous responses, no need for web scraping
      console.log(
        "💬 Follow-up question detected, using conversation context..."
      );

      const answer = await answerFollowUpQuestion(query, conversationHistory);

      return {
        query: query,
        status: "SUCCESS",
        analysis: answer,
        searchResults: null,
        timestamp: new Date().toISOString(),
        sourceCount: 0,
        sources: [],
      };
    }

    // Intent is VERIFY_INFORMATION, proceed with web scraping
    console.log("🔍 New verification request, proceeding with web scraping...");

    // Step 2: Search for news articles using real web scraping
    console.log("🔍 Phase 2: Searching Indonesian news sources...");
    const searchResults = await search(query);

    if (searchResults === "NOT_FOUND") {
      console.log("❌ No articles found for the query");
      return {
        query: query,
        status: "NO_ARTICLES_FOUND",
        analysis:
          "Tidak ditemukan artikel berita yang relevan untuk memverifikasi informasi ini. Silakan coba dengan kata kunci yang berbeda atau periksa sumber lain.",
        searchResults: null,
      };
    }

    if (searchResults === "ERROR") {
      console.log("❌ Error occurred during search");
      return {
        query: query,
        status: "SEARCH_ERROR",
        analysis:
          "Terjadi kesalahan saat mencari informasi. Silakan coba lagi nanti.",
        searchResults: null,
      };
    }

    const articles = searchResults as Article[];

    if (!articles || articles.length === 0) {
      console.log("❌ No articles found for the query");
      return {
        query: query,
        status: "NO_ARTICLES_FOUND",
        analysis:
          "Tidak ditemukan artikel berita yang relevan untuk memverifikasi informasi ini. Silakan coba dengan kata kunci yang berbeda atau periksa sumber lain.",
        searchResults: null,
      };
    }

    console.log(
      `✅ Found ${articles.length} articles from Indonesian news sources`
    );

    // Step 3: Analyze with Gemini AI
    console.log("\n🤖 Phase 3: Analyzing with Gemini AI...");
    const analysis = await analyzeWithGemini(query, articles);

    console.log("✅ Analysis completed\n");

    return {
      query: query,
      status: "SUCCESS",
      analysis: analysis,
      searchResults: articles,
      timestamp: new Date().toISOString(),
      sourceCount: articles.length,
      sources: [...new Set(articles.map((r: Article) => r.source))],
    };
  } catch (error) {
    console.error("Error in searchAndAnalyzeStateful:", error);
    return {
      query: query,
      status: "ERROR",
      analysis: `Terjadi kesalahan sistem: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      searchResults: null,
    };
  }
}

// Export default
export default searchAndAnalyze;
