import { useState, useRef, useEffect } from "react";
import { ChatModel, type Chat, type Message } from "../models/ChatModel";
import {
  searchAndAnalyzeStateful,
  generateChatTitle,
  type ConversationContext,
} from "../utils/geminiAnalysis";
import { auth } from "../config/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

export interface ChatControllerReturn {
  chats: Chat[];
  activeChat: string | null;
  messages: Message[];
  newMessage: string;
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  showProfileMenu: boolean;
  menuChatId: string | null;
  isAnalyzing: boolean;
  isLoading: boolean;
  currentUser: User | null;

  menuRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;

  setNewMessage: (message: string) => void;
  setActiveChat: (chatId: string | null) => void;
  setIsSidebarOpen: (open: boolean) => void;
  setShowProfileMenu: (show: boolean) => void;
  setMenuChatId: (chatId: string | null) => void;
  setIsDarkMode: (dark: boolean) => void;

  handleSend: () => void;
  handleNewChat: () => void;
  handleDeleteChat: (chatId: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;

  isOlderThan7Days: (chat: Chat) => boolean;
  toggleSidebar: () => void;
  toggleProfileMenu: () => void;
  toggleDarkMode: () => void;
}

export const useChatController = (): ChatControllerReturn => {
  const chatModel = new ChatModel();

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [menuChatId, setMenuChatId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPendingChat, setIsPendingChat] = useState<boolean>(false); // Track if current chat is not yet saved to Firestore

  const menuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // console.log("✅ User authenticated:", user.uid);

        const userChats = await chatModel.getUserChats(user.uid);
        setChats(userChats);

        if (userChats.length > 0 && !activeChat) {
          setActiveChat(userChats[0].id);
        }

        const unsubChats = chatModel.subscribeToUserChats(
          user.uid,
          (updatedChats) => {
            setChats(updatedChats);
            // console.log("📊 Chats updated:", updatedChats.length);
          },
          (error) => console.error("❌ Chat subscription error:", error)
        );

        setIsLoading(false);
        return () => unsubChats();
      } else {
        // console.log("❌ User not authenticated");
        setChats([]);
        setActiveChat(null);
        setMessages([]);
        setIsLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!activeChat || isPendingChat) {
      setMessages([]);
      return;
    }

    const unsubMessages = chatModel.subscribeToMessages(
      activeChat,
      (updatedMessages) => {
        setMessages(updatedMessages);
        // console.log("💬 Messages updated:", updatedMessages.length);
      },
      (error) => console.error("❌ Messages subscription error:", error)
    );

    return () => unsubMessages();
  }, [activeChat, isPendingChat]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuChatId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for theme changes from localStorage (e.g., from Profile component)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("theme");
      setIsDarkMode(saved === "dark");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleOutsideSidebar = (e: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      if (isSidebarOpen && sidebar && !sidebar.contains(e.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleOutsideSidebar);
    }
    return () =>
      document.removeEventListener("mousedown", handleOutsideSidebar);
  }, [isSidebarOpen]);

  const handleSend = async (): Promise<void> => {
    if (!newMessage.trim() || !currentUser) return;

    const userMessageText = newMessage;
    setNewMessage("");
    setIsAnalyzing(true);

    try {
      let chatId = activeChat;
      if (isPendingChat && !activeChat) {
        // console.log("🆕 Creating new chat with temporary title...");
        chatId = await chatModel.createNewChat(currentUser.uid, "New Chat");
        setActiveChat(chatId);
        setIsPendingChat(false);
        // console.log("✅ New chat created with ID:", chatId);

        generateChatTitle(userMessageText)
          .then(async (aiTitle) => {
            // console.log("🤖 Generated AI title:", aiTitle);
            try {
              if (chatId) {
                await chatModel.updateChatTitle(chatId, aiTitle);
                // console.log("✅ Chat title updated");
              }
            } catch (error) {
              console.error("❌ Error updating chat title:", error);
            }
          })
          .catch((error) => {
            console.error("❌ Error generating chat title:", error);
          });
      }

      if (!chatId) {
        console.error("❌ No chat ID available");
        return;
      }

      // console.log("💬 Saving user message to Firestore...");
      await chatModel.addMessage(chatId, true, userMessageText);
      // console.log("✅ User message saved");

      const conversationHistory: ConversationContext[] = messages.map(
        (msg) => ({
          role: msg.isUser ? "user" : "assistant",
          message: msg.message,
        })
      );

      conversationHistory.push({
        role: "user",
        message: userMessageText,
      });

      // console.log(
      //   `📚 Conversation history: ${conversationHistory.length} messages`
      // );

      const analysisResult = await searchAndAnalyzeStateful(
        userMessageText,
        conversationHistory
      );

      let aiResponseText = "";
      if (analysisResult.status === "SUCCESS") {
        if (analysisResult.sourceCount === 0) {
          aiResponseText = `💬 **Jawaban:**\n\n${analysisResult.analysis}`;
        } else {
          aiResponseText = `🔍 **Hasil Analisis untuk: "${userMessageText}"**\n\n${
            analysisResult.analysis
          }\n\n📊 **Detail:**\n- Status: ${
            analysisResult.status
          }\n- Sumber ditemukan: ${
            analysisResult.sourceCount
          }\n- Media: ${analysisResult.sources?.join(
            ", "
          )}\n\n---\n*Analisis dilakukan menggunakan AI dan sumber berita Indonesia.*`;
        }
        // console.log("Analisis: ", aiResponseText);
      } else if (analysisResult.status === "NO_ARTICLES_FOUND") {
        aiResponseText = `ℹ️ **Tidak ditemukan artikel untuk: "${userMessageText}"**\n\n${analysisResult.analysis}`;
      } else {
        aiResponseText = `❌ **Error saat menganalisis: "${userMessageText}"**\n\n${analysisResult.analysis}`;
      }

      // console.log("🤖 Saving AI response to Firestore...");
      await chatModel.addMessage(chatId, false, aiResponseText);
      // console.log("✅ Conversation saved to Firestore");
    } catch (error) {
      console.error("❌ Error in handleSend:", error);
      const errorMessage = `Maaf, terjadi kesalahan saat menganalisis pesan Anda. Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }. Silakan coba lagi.`;

      try {
        if (activeChat && !isPendingChat) {
          await chatModel.addMessage(activeChat, false, errorMessage);
        }
      } catch (saveError) {
        console.error("❌ Error saving error message:", saveError);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewChat = async (): Promise<void> => {
    if (!currentUser) return;

    try {
      // console.log("🆕 Creating pending chat (will save on first message)");
      setActiveChat(null);
      setMessages([]);
      setIsPendingChat(true);
      // console.log("✅ Pending chat created - waiting for first message");
    } catch (error) {
      console.error("❌ Error creating pending chat:", error);
    }
  };

  const handleDeleteChat = async (chatId: string): Promise<void> => {
    try {
      await chatModel.deleteChat(chatId);
      setMenuChatId(null);

      if (chatId === activeChat) {
        const remainingChats = chats.filter((c) => c.id !== chatId);
        setActiveChat(remainingChats.length > 0 ? remainingChats[0].id : null);
      }

      // console.log("✅ Chat deleted:", chatId);
    } catch (error) {
      console.error("❌ Error deleting chat:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileMenu = (): void => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toggleDarkMode = (): void => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");
      return newValue;
    });
  };

  const isOlderThan7Days = (chat: Chat): boolean => {
    const daysDiff =
      (Date.now() - chat.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff > 7;
  };

  return {
    chats,
    activeChat,
    messages,
    newMessage,
    isDarkMode,
    isSidebarOpen,
    showProfileMenu,
    menuChatId,
    isAnalyzing,
    isLoading,
    currentUser,

    menuRef,
    messagesEndRef,

    setNewMessage,
    setActiveChat: (chatId: string | null) => {
      setActiveChat(chatId);
      setIsPendingChat(false); // When switching to an existing chat, it's not pending
      setIsSidebarOpen(false);
    },
    setIsSidebarOpen,
    setShowProfileMenu,
    setMenuChatId,
    setIsDarkMode,

    handleSend,
    handleNewChat,
    handleDeleteChat,
    handleKeyDown,

    isOlderThan7Days,
    toggleSidebar,
    toggleProfileMenu,
    toggleDarkMode,
  };
};
