# Stateful Chatbot Implementation

## Overview

The chatbot is now **stateful** - it can remember previous messages in the same conversation session and intelligently decide whether to verify new information or answer follow-up questions.

## Key Features

### 🧠 Conversation Memory

- Remembers all messages in the current chat session
- Builds conversation context from previous user questions and AI responses
- Context is session-specific (per chat, not global)

### 🎯 Intent Classification

The AI classifies each user message into two categories:

1. **VERIFY_INFORMATION** - User wants to verify new information/news

   - Triggers web scraping from Indonesian news sources
   - Performs full fact-checking analysis
   - Example: "Apakah benar presiden akan perpanjang masa jabatan?"

2. **FOLLOWUP_QUESTION** - User asks about previous responses
   - Uses conversation context (no web scraping needed)
   - Faster response time
   - Examples: "Maksudnya apa?", "Jelaskan lebih detail", "Apa hubungannya dengan..."

### 🔍 Smart Response Formatting

- **New Verification**: Shows full analysis with sources, status, and media
- **Follow-up Answer**: Shows simpler response format without redundant details

## Technical Implementation

### 1. New Types & Interfaces

```typescript
export interface ConversationContext {
  role: "user" | "assistant";
  message: string;
}
```

### 2. Intent Classification Function

```typescript
async function classifyUserIntent(
  query: string,
  conversationHistory: ConversationContext[]
): Promise<"VERIFY_INFORMATION" | "FOLLOWUP_QUESTION">;
```

**How it works:**

- Analyzes user query in context of conversation history
- Checks for keywords like "maksudnya", "jelaskan", "apa itu", "bagaimana", "kenapa"
- If no history exists → defaults to VERIFY_INFORMATION
- Uses Gemini AI for intelligent classification

### 3. Follow-up Question Handler

```typescript
async function answerFollowUpQuestion(
  query: string,
  conversationHistory: ConversationContext[]
): Promise<string>;
```

**How it works:**

- Takes full conversation history as context
- Uses Gemini AI to answer based on previous responses
- No web scraping needed
- Returns contextual answer

### 4. Stateful Analysis Function

```typescript
export async function searchAndAnalyzeStateful(
  query: string,
  conversationHistory: ConversationContext[] = []
): Promise<AnalysisResult>;
```

**Flow:**

1. Classify user intent
2. If FOLLOWUP_QUESTION → answer from context
3. If VERIFY_INFORMATION → perform web scraping and analysis
4. Return appropriate response

### 5. Controller Integration

**ChatController.ts** builds conversation history from messages:

```typescript
// Build conversation history
const conversationHistory: ConversationContext[] = messages.map((msg) => ({
  role: msg.isUser ? "user" : "assistant",
  message: msg.message,
}));

// Add current message
conversationHistory.push({
  role: "user",
  message: userMessageText,
});

// Call stateful analysis
const analysisResult = await searchAndAnalyzeStateful(
  userMessageText,
  conversationHistory
);
```

## Example Conversations

### Example 1: New Verification → Follow-up Question

**User:** "Apakah benar vaksin COVID menyebabkan autisme?"
**AI:** _[Performs web scraping, analyzes sources]_  
🔍 **Hasil Analisis...**  
📊 **Detail:** Status: SUCCESS, Sumber: 3, Media: Kompas, Detik...

**User:** "Jelaskan lebih detail tentang penelitian yang kamu sebutkan"
**AI:** _[No web scraping, uses previous context]_  
💬 **Jawaban:** Berdasarkan informasi sebelumnya, penelitian yang disebutkan...

### Example 2: Multiple Follow-ups

**User:** "Benarkah listrik akan naik tahun ini?"
**AI:** _[Web scraping + analysis]_

**User:** "Apa alasan kenaikannya?"
**AI:** _[Uses context]_

**User:** "Bagaimana dampaknya ke masyarakat?"
**AI:** _[Uses context]_

**User:** "Apakah benar akan ada subsidi untuk rakyat kecil?"
**AI:** _[New verification - web scraping again]_

## Files Modified

### 1. `src/utils/geminiAnalysis.ts`

- Added `ConversationContext` interface
- Added `classifyUserIntent()` function
- Added `answerFollowUpQuestion()` function
- Added `searchAndAnalyzeStateful()` function (main stateful version)
- Kept original `searchAndAnalyze()` for backward compatibility

### 2. `src/controllers/ChatController.ts`

- Imported `searchAndAnalyzeStateful` and `ConversationContext`
- Updated `handleSend()` to build conversation history
- Maps messages to ConversationContext array
- Passes history to stateful analysis function
- Different response formatting for verification vs follow-up

## Benefits

✅ **Better UX** - Users can ask clarifying questions without repeating context  
✅ **Faster Responses** - Follow-up questions don't require web scraping  
✅ **Natural Conversation** - Feels like chatting with a human expert  
✅ **Cost Efficient** - Reduces unnecessary API calls for web scraping  
✅ **Intelligent** - AI determines when to search vs when to use context  
✅ **Context Aware** - Remembers entire conversation session

## Performance Impact

### Follow-up Questions

- **Response Time:** ~2-5 seconds (vs 15-30 seconds for verification)
- **No web scraping:** Saves bandwidth and API calls
- **Lower cost:** Only Gemini AI inference, no search operations

### New Verifications

- **Response Time:** Same as before (15-30 seconds)
- **Full fact-checking:** Web scraping + analysis as usual

## Conversation Context Scope

**Per Chat Session:**

- Each chat maintains its own conversation history
- Switching chats = new context
- Context cleared when creating new chat

**Not Persisted:**

- Context built from messages in current session
- When page reloads, context rebuilt from Firestore messages
- No separate storage needed - uses existing message data

## Testing Scenarios

### Test 1: Intent Classification

1. Start new chat
2. Ask: "Apakah Jokowi akan menjadi presiden lagi?"
3. ✅ Should perform web scraping (VERIFY_INFORMATION)
4. Ask: "Maksudnya bagaimana?"
5. ✅ Should use context (FOLLOWUP_QUESTION)

### Test 2: Multiple Topics

1. Ask about Topic A
2. Ask follow-up about Topic A
3. Ask about Topic B (new verification)
4. Ask follow-up about Topic B
5. ✅ Each topic should trigger web scraping, follow-ups use context

### Test 3: Context Awareness

1. Ask verification question
2. Ask: "Apa dampaknya?"
3. ✅ Should reference previous response
4. Ask: "Siapa yang terkena dampak?"
5. ✅ Should maintain full conversation context

## Future Enhancements

Possible improvements:

- [ ] Summarize very long conversation histories
- [ ] Allow users to explicitly request new verification
- [ ] Add "continue from last topic" when creating new chat
- [ ] Show indicator when using context vs new search
- [ ] Add conversation branches for complex topics
