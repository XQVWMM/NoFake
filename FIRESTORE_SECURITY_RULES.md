# Firestore Security Rules for NoFake Chat System

## Required Firestore Security Rules

To ensure proper security for the chat system, add the following rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chat collection rules
    match /chats/{chatId} {
      // Users can only read, write, update, and delete their own chats
      allow read, write, update, delete: if request.auth != null &&
        request.auth.uid == resource.data.uid;

      // Allow users to create new chats with their own uid
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.uid;

      // Messages subcollection rules
      match /messages/{messageId} {
        // Users can only access messages within their own chats
        allow read, write, create, update, delete: if request.auth != null &&
          request.auth.uid == get(/databases/$(database)/documents/chats/$(chatId)).data.uid;
      }
    }

    // User profiles collection (if you plan to add this later)
    match /users/{userId} {
      allow read, write, update, delete: if request.auth != null &&
        request.auth.uid == userId;
    }
  }
}
```

## Rule Explanation

### Chat Collection Security:

- **Authentication Required**: All operations require user authentication (`request.auth != null`)
- **User Isolation**: Users can only access chats where `uid` field matches their authenticated user ID
- **CRUD Operations**: Users have full control (create, read, update, delete) over their own chats
- **Data Integrity**: When creating new chats, the `uid` field must match the authenticated user's ID

### Messages Subcollection Security:

- **Parent Chat Validation**: Messages can only be accessed if the parent chat belongs to the authenticated user
- **Automatic Inheritance**: Message access is controlled through chat ownership
- **Full CRUD Access**: Users can create, read, update, and delete messages in their own chats
- **Cross-Reference Security**: Uses `get()` function to verify chat ownership

### Key Security Features:

1. **User Data Isolation**: Each user can only see and modify their own chats and messages
2. **Authentication Enforcement**: All database operations require valid authentication
3. **Field-Level Security**: The `uid` field ensures ownership validation
4. **Prevent Data Leakage**: No cross-user data access is possible
5. **Subcollection Protection**: Messages are protected through parent chat ownership verification

## Implementation Steps:

1. Go to Firebase Console → Firestore Database → Rules
2. Replace existing rules with the rules above
3. Test the rules in the Firebase console simulator
4. Publish the rules

## Testing:

Use the Firebase console Rules simulator to test:

- Authenticated user accessing their own chat: ✅ Should work
- Authenticated user accessing another user's chat: ❌ Should be denied
- Authenticated user accessing messages in their own chat: ✅ Should work
- Authenticated user accessing messages in another user's chat: ❌ Should be denied
- Unauthenticated access: ❌ Should be denied
- Creating chat with wrong uid: ❌ Should be denied

## Database Structure:

```
chats (collection)
├── {chatId} (document)
│   ├── uid: string (user ID)
│   ├── title: string
│   ├── createdAt: timestamp
│   ├── lastActivity: timestamp
│   ├── messageCount: number
│   └── messages (subcollection)
│       └── {messageId} (document)
│           ├── text: string
│           ├── isUser: boolean
│           ├── timestamp: timestamp
│           ├── date?: string
│           └── analysisComplete: boolean
```

## Field Requirements:

### Chat Documents:

- `uid` (string): The authenticated user's ID
- `title` (string): Chat title
- `createdAt` (timestamp): Creation timestamp
- `lastActivity` (timestamp): Last activity timestamp
- `messageCount` (number): Number of messages in subcollection

### Message Documents (in subcollection):

- `text` (string): Message content
- `isUser` (boolean): Whether message is from user or AI
- `timestamp` (timestamp): Message timestamp
- `date` (string, optional): Formatted date string
- `analysisComplete` (boolean): Whether LLM analysis is complete
