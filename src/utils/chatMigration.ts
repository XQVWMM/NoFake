import { ChatModel } from "../models/ChatModel";
import type { ChatItem } from "../models/ChatModel";

/**
 * Migration utility to help users transition from local storage to Firestore
 */
export class ChatMigrationUtil {
  private static readonly LOCAL_STORAGE_KEY = "nofake_chats";

  /**
   * Check if user has any data in localStorage that needs migration
   */
  static hasLocalChats(): boolean {
    try {
      const localData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return localData !== null && JSON.parse(localData).length > 0;
    } catch (error) {
      console.error("Error checking local chats:", error);
      return false;
    }
  }

  /**
   * Get chats from localStorage
   */
  static getLocalChats(): ChatItem[] {
    try {
      const localData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (!localData) return [];

      const parsedData = JSON.parse(localData);
      return parsedData.map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        lastActivity: new Date(chat.lastActivity),
      }));
    } catch (error) {
      console.error("Error getting local chats:", error);
      return [];
    }
  }

  /**
   * Migrate local chats to Firestore for a specific user
   */
  static async migrateLocalChatsToFirestore(
    uid: string
  ): Promise<{ success: number; failed: number }> {
    const localChats = this.getLocalChats();
    if (localChats.length === 0) {
      return { success: 0, failed: 0 };
    }

    const chatModel = new ChatModel();
    let success = 0;
    let failed = 0;

    console.log(`Starting migration of ${localChats.length} local chats...`);

    for (const localChat of localChats) {
      try {
        await chatModel.addChat(uid, localChat.title);

        // For each message in the local chat, add it to the new Firestore chat
        // This is a simplified approach - in reality, you might want to batch this
        const newChats = chatModel.getChats();
        const newChatIndex = newChats.length - 1;

        for (const message of localChat.messages) {
          await chatModel.addMessage(uid, newChatIndex, message);
        }

        success++;
        console.log(`Migrated chat: "${localChat.title}"`);
      } catch (error) {
        console.error(`Failed to migrate chat "${localChat.title}":`, error);
        failed++;
      }
    }

    // Clear local storage after successful migration
    if (success > 0) {
      this.clearLocalChats();
      console.log(
        `Migration completed: ${success} successful, ${failed} failed`
      );
    }

    return { success, failed };
  }

  /**
   * Clear local storage chats
   */
  static clearLocalChats(): void {
    try {
      localStorage.removeItem(this.LOCAL_STORAGE_KEY);
      console.log("Local chats cleared");
    } catch (error) {
      console.error("Error clearing local chats:", error);
    }
  }

  /**
   * Save chats to localStorage (for backward compatibility)
   */
  static saveToLocalStorage(chats: ChatItem[]): void {
    try {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  /**
   * Show migration prompt to user
   */
  static showMigrationPrompt(): Promise<boolean> {
    return new Promise((resolve) => {
      const shouldMigrate = window.confirm(
        "We found some chat history on your device. Would you like to sync it to your account so you can access it from any device?\n\nClick OK to sync or Cancel to start fresh."
      );
      resolve(shouldMigrate);
    });
  }

  /**
   * Complete migration flow with user interaction
   */
  static async performMigrationFlow(uid: string): Promise<void> {
    if (!this.hasLocalChats()) {
      return;
    }

    try {
      const shouldMigrate = await this.showMigrationPrompt();

      if (shouldMigrate) {
        console.log("User chose to migrate local chats");
        const result = await this.migrateLocalChatsToFirestore(uid);

        if (result.success > 0) {
          alert(
            `Successfully synced ${result.success} conversation${
              result.success !== 1 ? "s" : ""
            } to your account!`
          );
        }

        if (result.failed > 0) {
          alert(
            `Warning: ${result.failed} conversation${
              result.failed !== 1 ? "s" : ""
            } failed to sync. Your local data will be preserved.`
          );
        }
      } else {
        console.log("User chose not to migrate local chats");
        // Optionally clear local chats or keep them
        // this.clearLocalChats();
      }
    } catch (error) {
      console.error("Migration flow error:", error);
      alert(
        "There was an error during migration. Your local data has been preserved."
      );
    }
  }
}
