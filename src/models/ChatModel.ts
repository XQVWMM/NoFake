import { ChatService, type Chat, type Message } from "../services/chatService";

export type { Chat, Message };

export interface ChatWithMessages extends Chat {
  messages: Message[];
}

export class ChatModel {
  async createNewChat(
    userId: string,
    title: string = "New Chat"
  ): Promise<string> {
    return await ChatService.createNewChat(userId, title);
  }

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    return await ChatService.updateChatTitle(chatId, title);
  }

  async addMessage(
    chatId: string,
    isUser: boolean,
    message: string
  ): Promise<string> {
    return await ChatService.addMessage(chatId, isUser, message);
  }

  async addConversationPair(
    chatId: string,
    userMessage: string,
    aiResponse: string
  ): Promise<void> {
    return await ChatService.addConversationPair(
      chatId,
      userMessage,
      aiResponse
    );
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return await ChatService.getUserChats(userId);
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return await ChatService.getMessages(chatId);
  }

  async deleteChat(chatId: string): Promise<void> {
    return await ChatService.deleteChat(chatId);
  }

  subscribeToUserChats(
    userId: string,
    callback: (chats: Chat[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    return ChatService.subscribeToUserChats(userId, callback, onError);
  }

  subscribeToMessages(
    chatId: string,
    callback: (messages: Message[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    return ChatService.subscribeToMessages(chatId, callback, onError);
  }
}
