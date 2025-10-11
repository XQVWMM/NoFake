import React from "react";
import { useChatController } from "../../../controllers/ChatController";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import logo from "../../../assets/transparentBackground.png";
import chatLogo from "../../../assets/chatIcon.svg";
import chatLogoDark from "../../../assets/chatIconWhite.svg";
import ChatBubble from "../../components/chatBubble";
import sendIcon from "../../../assets/sendIcon.svg";
import sendIconDark from "../../../assets/sendIconDark.svg";
import { Moon, Sun, Menu, X } from "lucide-react";

const ChatPage: React.FC = () => {
  const {
    // State
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

    // Refs
    menuRef,
    messagesEndRef,

    // Handlers
    setNewMessage,
    setActiveChat,
    setShowProfileMenu,
    setMenuChatId,

    // Actions
    handleSend,
    handleNewChat,
    handleDeleteChat,
    handleKeyDown,

    // Utilities
    isOlderThan7Days,
    toggleSidebar,
    // toggleProfileMenu,
    toggleDarkMode,
  } = useChatController();

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowProfileMenu(false);
      // Redirect will be handled by auth state change in the controller
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`flex h-screen items-center justify-center ${
          isDarkMode
            ? "bg-[#0F172A] text-gray-200"
            : "bg-[#F7FAFC] text-gray-800"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-lg">Loading your conversations...</p>
          {currentUser && (
            <p className="text-sm opacity-75">
              Welcome back, {currentUser.email}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Authentication check
  if (!currentUser) {
    return (
      <div
        className={`flex h-screen items-center justify-center ${
          isDarkMode
            ? "bg-[#0F172A] text-gray-200"
            : "bg-[#F7FAFC] text-gray-800"
        }`}
      >
        <div className="flex flex-col items-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please log in to access your conversations and save your chat
              history.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Sign In
              </button>
              <button
                onClick={() => (window.location.href = "/register")}
                className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Create Account
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-6 py-2 transition-colors duration-200"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-screen font-sans transition-colors duration-300 ${
        isDarkMode ? "bg-[#0F172A] text-gray-200" : "bg-[#F7FAFC] text-gray-800"
      }`}
    >
      {/* BACKDROP (mobile only) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"></div>
      )}

      {/* SIDEBAR */}
      <div
        id="sidebar"
        className={`fixed md:static top-0 left-0 h-full w-3/4 md:w-1/4 flex flex-col transition-all duration-300 z-50 
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          ${isDarkMode ? "bg-[#345A66]" : "bg-[#BEE3F8]"}
        `}
      >
        {/* Header Logo */}
        <div className="flex items-center justify-center relative mt-6 mb-4">
          <img src={logo} alt="Logo" className="w-36 h-auto object-contain" />
          <button
            className="absolute right-5 md:hidden text-gray-800 dark:text-gray-200 bg-black/30 p-1.5 rounded-md"
            onClick={toggleSidebar}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tombol Chat Baru */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 bg-[#172A3A] text-white px-8 py-2 rounded-lg text-[clamp(0.9rem,1vw,1rem)] font-medium shadow-md hover:opacity-80 transition-all duration-200"
          >
            <span className="text-lg font-bold">＋</span>
            <span>Obrolan Baru</span>
          </button>
        </div>

        {/* Daftar Chat */}
        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto px-4 pb-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChat(chat.id);
              }}
              className={`group relative flex flex-col px-3 py-3 rounded-md shadow-sm cursor-pointer transition ${
                chat.id === activeChat
                  ? isDarkMode
                    ? "border-l-4 border-gray-400 bg-[#1B263B]"
                    : "border-l-4 border-gray-500 bg-gray-100"
                  : isDarkMode
                  ? "bg-[#0D1B2A] hover:bg-[#1E2A40]"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                {/* KIRI: ICON + TITLE */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={isDarkMode ? chatLogoDark : chatLogo}
                      alt="Chat Icon"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <p
                    className={`truncate flex-1 min-w-0 text-[clamp(0.85rem,1vw+0.5rem,1.05rem)] ${
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {chat.title}
                  </p>
                </div>

                <span
                  className={`font-bold cursor-pointer transition-opacity ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  } ${
                    menuChatId === chat.id
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuChatId(menuChatId === chat.id ? null : chat.id);
                  }}
                >
                  ⋯
                </span>
              </div>

              {isOlderThan7Days(chat) && (
                <p className="text-[11px] text-red-500 mt-1 ml-8 italic">
                  Lebih dari 7 hari lalu
                </p>
              )}

              {menuChatId === chat.id && (
                <div
                  ref={menuRef}
                  className={`absolute right-2 top-8 ${
                    isDarkMode ? "bg-[#1B263B] text-gray-200" : "bg-white"
                  } shadow-lg rounded-md z-50 w-32`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2E3A55]">
                    Share
                  </button>
                  <button
                    onClick={() => handleDeleteChat(chat.id)}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-[#3B1D1D]"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Profile + Dark Mode Section */}
        <div
          className={`relative py-5 px-5 flex items-center justify-between mt-auto ${
            isDarkMode ? "bg-[#1B263B]" : "bg-[#172A3A]"
          }`}
        >
          {/* Profil kiri */}
          <div className="flex items-center space-x-3">
            <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-gray-700 font-semibold text-sm">
                {currentUser?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-white">
                {currentUser?.email || "User"}
              </p>
              <p className="text-xs text-gray-300">
                {chats.length} conversation{chats.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Tombol kanan */}
          <div className="flex items-center space-x-3">
            {/* Tombol dark mode */}
            <button
              onClick={toggleDarkMode}
              className="text-gray-300 hover:text-white transition text-xl"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-200" />
              )}
            </button>

            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="text-gray-300 text-xl font-bold hover:text-white transition"
              title="Profile Menu"
            >
              ⋯
            </button>

            {showProfileMenu && (
              <div
                className={`absolute bottom-16 right-5 rounded-md shadow-lg py-2 w-36 z-50 ${
                  isDarkMode
                    ? "bg-[#0D1B2A] text-gray-100"
                    : "bg-white text-gray-800"
                }`}
              >
                <button
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                    isDarkMode
                      ? "hover:bg-gray-700 hover:text-white hover:cursor-pointer"
                      : "hover:bg-gray-100 hover:cursor-pointer"
                  }`}
                >
                  Settings
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                    isDarkMode
                      ? "hover:bg-gray-700 hover:text-white hover:cursor-pointer"
                      : "hover:bg-gray-100 hover:cursor-pointer"
                  }`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat*/}
      <div
        className={`flex-1 flex flex-col transition-colors duration-300 ${
          isDarkMode ? "bg-[#172A3A]" : "bg-[#F7FAFC]"
        }`}
      >
        {/* Hamburger (mobile only) */}
        <div className="md:hidden flex items-center p-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 dark:text-gray-200"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Pesan Chat */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p
                className={`text-2xl font-semibold text-center animate-fadeIn ${
                  isDarkMode ? "text-gray-100" : "text-[#1A202C]"
                }`}
              >
                Apa yang Bisa Saya Bantu?
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto w-full">
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  text={msg.message}
                  isUser={msg.isUser}
                  isDarkMode={isDarkMode}
                />
              ))}
              {isAnalyzing && (
                <div className="flex justify-start">
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? "bg-[#2D3748] text-gray-200"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm">Menganalisis dengan AI...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-6 py-4 transition-colors duration-300">
          <div
            className={`max-w-4xl mx-auto flex items-center rounded-lg px-4 border ${
              isDarkMode
                ? "bg-[#1E293B] border-gray-700"
                : "bg-gray-100 border-gray-300"
            } ${isAnalyzing ? "opacity-50" : ""}`}
          >
            <input
              type="text"
              placeholder={
                isAnalyzing ? "Sedang menganalisis..." : "Tulis pesan di sini"
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAnalyzing}
              className={`flex-1 bg-transparent outline-none py-3 ${
                isDarkMode
                  ? "text-gray-100 placeholder-gray-400"
                  : "text-gray-700 placeholder-gray-500"
              } ${isAnalyzing ? "cursor-not-allowed" : ""}`}
            />
            <button
              onClick={handleSend}
              disabled={isAnalyzing}
              className={`transition-transform duration-200 ${
                isAnalyzing
                  ? "cursor-not-allowed opacity-50"
                  : "hover:scale-110"
              }`}
            >
              <img
                src={isDarkMode ? sendIconDark : sendIcon}
                alt="Send"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
