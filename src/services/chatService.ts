import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  userId: string;
}

export interface Message {
  id: string;
  timestamp: Date;
  isUser: boolean;
  message: string;
}

export interface ChatWithMessages extends Chat {
  messages: Message[];
}

export class ChatService {
  private static readonly CHATS_COLLECTION = "chats";
  private static readonly MESSAGES_SUBCOLLECTION = "messages";

  static async createNewChat(
    userId: string,
    title: string = "New Chat"
  ): Promise<string> {
    try {
      const chatRef = await addDoc(collection(db, this.CHATS_COLLECTION), {
        title,
        timestamp: serverTimestamp(),
        userId,
      });
      console.log("New chat created:", chatRef.id);
      return chatRef.id;
    } catch (error) {
      console.error("Error creating chat:", error);
      throw new Error("Failed to create chat");
    }
  }

  static async updateChatTitle(chatId: string, title: string): Promise<void> {
    try {
      const chatRef = doc(db, this.CHATS_COLLECTION, chatId);
      await updateDoc(chatRef, { title });
      console.log("Chat title updated:", chatId, title);
    } catch (error) {
      console.error("Error updating chat title:", error);
      throw new Error("Failed to update chat title");
    }
  }

  static async addMessage(
    chatId: string,
    isUser: boolean,
    message: string
  ): Promise<string> {
    try {
      const messagesRef = collection(
        db,
        this.CHATS_COLLECTION,
        chatId,
        this.MESSAGES_SUBCOLLECTION
      );
      const messageDoc = await addDoc(messagesRef, {
        timestamp: serverTimestamp(),
        isUser,
        message,
      });
      console.log("Message added to chat", chatId, messageDoc.id);
      return messageDoc.id;
    } catch (error) {
      console.error("Error adding message:", error);
      throw new Error("Failed to add message");
    }
  }

  static async addConversationPair(
    chatId: string,
    userMessage: string,
    aiResponse: string
  ): Promise<void> {
    try {
      console.log("Saving conversation pair to chat:", chatId);
      await this.addMessage(chatId, true, userMessage);
      await this.addMessage(chatId, false, aiResponse);
      console.log("Conversation pair saved successfully");
    } catch (error) {
      console.error("Error saving conversation pair:", error);
      throw new Error("Failed to save conversation pair");
    }
  }

  static async getMessages(chatId: string): Promise<Message[]> {
    try {
      const messagesRef = collection(
        db,
        this.CHATS_COLLECTION,
        chatId,
        this.MESSAGES_SUBCOLLECTION
      );
      const q = query(messagesRef, orderBy("timestamp", "asc"));
      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          timestamp: data.timestamp?.toDate() || new Date(),
          isUser: data.isUser,
          message: data.message,
        });
      });
      return messages;
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  }

  static async getUserChats(userId: string): Promise<Chat[]> {
    try {
      const q = query(
        collection(db, this.CHATS_COLLECTION),
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const chats: Chat[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        chats.push({
          id: doc.id,
          title: data.title,
          timestamp: data.timestamp?.toDate() || new Date(),
          userId: data.userId,
        });
      });
      console.log("Retrieved chats for user:", userId, chats.length);
      return chats;
    } catch (error) {
      console.error("Error getting user chats:", error);
      return [];
    }
  }

  static async deleteChat(chatId: string): Promise<void> {
    try {
      const messagesRef = collection(
        db,
        this.CHATS_COLLECTION,
        chatId,
        this.MESSAGES_SUBCOLLECTION
      );
      const messagesSnapshot = await getDocs(messagesRef);
      const batch = writeBatch(db);
      messagesSnapshot.docs.forEach((messageDoc) => {
        batch.delete(messageDoc.ref);
      });
      await batch.commit();
      await deleteDoc(doc(db, this.CHATS_COLLECTION, chatId));
      console.log("Chat and all messages deleted:", chatId);
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw new Error("Failed to delete chat");
    }
  }

  static subscribeToUserChats(
    userId: string,
    callback: (chats: Chat[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    try {
      const q = query(
        collection(db, this.CHATS_COLLECTION),
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const chats: Chat[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            chats.push({
              id: doc.id,
              title: data.title,
              timestamp: data.timestamp?.toDate() || new Date(),
              userId: data.userId,
            });
          });
          callback(chats);
        },
        (error) => {
          console.error("Error in chat subscription:", error);
          if (onError) onError(new Error("Failed to sync chats"));
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up chat subscription:", error);
      if (onError) onError(new Error("Failed to setup chat sync"));
      return () => {};
    }
  }

  static subscribeToMessages(
    chatId: string,
    callback: (messages: Message[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    try {
      const messagesRef = collection(
        db,
        this.CHATS_COLLECTION,
        chatId,
        this.MESSAGES_SUBCOLLECTION
      );
      const q = query(messagesRef, orderBy("timestamp", "asc"));
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const messages: Message[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({
              id: doc.id,
              timestamp: data.timestamp?.toDate() || new Date(),
              isUser: data.isUser,
              message: data.message,
            });
          });
          callback(messages);
        },
        (error) => {
          console.error("Error in messages subscription:", error);
          if (onError) onError(new Error("Failed to sync messages"));
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up messages subscription:", error);
      if (onError) onError(new Error("Failed to setup messages sync"));
      return () => {};
    }
  }
}
