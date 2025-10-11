import requests
from bs4 import BeautifulSoup
import time
import random
import urllib.parse
from datetime import datetime

INDONESIA_NEWS_SITES = {
    'Kompas': {
        'base_url': 'https://www.kompas.com',
        'search_url': 'https://search.kompas.com/search?q=',
        'article_selector': '.article-link',
        'title_selector': '.article-link .articleTitle',
        'content_selector': '.articleLead p'
    },
    'Detik': {
        'base_url': 'https://www.detik.com',
        'search_url': 'https://www.detik.com/search/searchall?query=',
        'article_selector': '.media__title a',
        'title_selector': '.media__title',
        'content_selector': '.media__desc'
    },
    'AntaraNews': {
        'base_url': 'https://www.antaranews.com',
        'search_url': 'https://www.antaranews.com/search?q=',
        'article_selector': '.card__post__content .card__post__title h2 a',
        'title_selector': '.card__post__content .card__post__title h2 a',
        'content_selector': '.card__post__content p'
    },
    
}

def get_user_agent():
    """Return a random user agent"""
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
    ]
    return random.choice(user_agents)

def search_news_site(site_name, site_info, query, max_results=5):
    """Search for news articles on a specific site based on query"""
    try:
        headers = {'User-Agent': get_user_agent()}
        search_url = site_info['search_url'] + urllib.parse.quote(query)
        
        print(f"Searching {site_name}...")
        response = requests.get(search_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        articles = []
        
        # Find article links
        article_links = soup.select(site_info['article_selector'])
        
        for link in article_links[:max_results]:
            href = link.get('href')
            if href:
                # Convert relative URLs to absolute
                if href.startswith('/'):
                    full_url = site_info['base_url'] + href
                else:
                    full_url = href
                
                # Get title
                title_elem = link.select_one(site_info.get('title_selector', ''))

                title = 'No title'
                if (title_elem):
                    title = title_elem.get_text().strip()
                elif (site_name == 'Detik'):
                    title = link.get('dtr-ttl')
                elif (site_name == "AntaraNews"):
                    title = link.get('title')
                elif (site_name == 'CNN Indonesia'):
                    title = link.get('ttl')
                    print(title)
                
                articles.append({
                    'title': title,
                    'url': full_url,
                    'source': site_name
                })
        
        return articles
    
    except Exception as e:
        print(f"Error searching {site_name}: {e}")
        return []

def scrape_article_content(url, content_selector):
    """Scrape the main content from a news article"""
    try:
        headers = {'User-Agent': get_user_agent()}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Try the specific content selector first
        content_elem = soup.select_one(content_selector)
        
        # If specific selector fails, try common content areas
        if not content_elem:
            for selector in ['article', '.article-content', '.post-content', '.content', '[class*="content"]']:
                content_elem = soup.select_one(selector)
                if content_elem:
                    break
        
        if content_elem:
            # Remove unwanted elements
            for element in content_elem.select('script, style, nav, header, footer, .ads, .advertisement'):
                element.decompose()
            
            # Get all paragraphs
            paragraphs = content_elem.find_all('p')
            content = '\n'.join([p.get_text().strip() for p in paragraphs if p.get_text().strip()])
            
            if content:
                return content
        
        # Fallback: get all text and clean it
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        content = ' '.join(chunk for chunk in chunks if chunk)
        
        return content[:2000]  # Limit content length
    
    except Exception as e:
        return f"Error scraping content: {e}"

def search_all_news_sites(query, max_results_per_site=3):
    """Search all news sites for the given query"""
    all_articles = []
    
    # print(f"🔍 Searching for: '{query}'")
    # print("=" * 60)
    
    for site_name, site_info in INDONESIA_NEWS_SITES.items():
        articles = search_news_site(site_name, site_info, query, max_results_per_site)
        all_articles.extend(articles)
        time.sleep(1) 
    
    return all_articles

def scrape_articles_content(articles):
    """Scrape content for all collected articles"""
    results = []
    
    # print(f"\n📄 Scraping content from {len(articles)} articles...")
    # print("=" * 60)
    
    for i, article in enumerate(articles, 1):
        # print(article)
        # print(f"Scraping {i}/{len(articles)}: {article['source']} - {article['title'][:50]}...")
        
        site_info = INDONESIA_NEWS_SITES[article['source']]
        content = scrape_article_content(article['url'], site_info['content_selector'])
        
        article['content'] = content
        article['scraped_at'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        results.append(article)
        
        time.sleep(1)  # Be polite between requests
    
    return results

def display_results(results, query):
    """Display the search and scraping results"""
    print(f"\n🎯 SEARCH RESULTS FOR: '{query}'")
    print("=" * 80)
    
    for i, result in enumerate(results, 1):
        print(f"\n{'='*50}")
        print(f"RESULT {i}: {result['source']}")
        print(f"{'='*50}")
        print(f"📰 TITLE: {result['title']}")
        print(f"🔗 URL: {result['url']}")
        print(f"⏰ SCRAPED: {result['scraped_at']}")
        print(f"\n📝 CONTENT:")
        print("-" * 50)
        
        content = result['content']
        if len(content) > 1000:
            print(content[:1000] + "...")
            print(f"\n[Content truncated - full content length: {len(content)} characters]")
        else:
            print(content)
        
        print(f"\n📊 CONTENT LENGTH: {len(content)} characters")
        print(f"{'='*50}\n")

def search(query):
    # Step 1: Search all news sites
    articles = search_all_news_sites(query, max_results_per_site=3)
    
    if not articles:
        return "NOT FOUND"
        
    # Step 2: Scrape content from all articles
    results = scrape_articles_content(articles)
    return results