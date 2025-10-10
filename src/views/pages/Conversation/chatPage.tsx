import React, { useState, useRef, useEffect } from "react";
import logo from "../../../assets/transparentBackground.png";
import chatLogo from "../../../assets/chatIcon.svg";
import chatLogoDark from "../../../assets/chatIconWhite.svg";
import ChatBubble from "../../components/chatBubble";
import sendIcon from "../../../assets/sendIcon.svg";
import sendIconDark from "../../../assets/sendIconDark.svg";
import { Moon, Sun, Menu, X } from "lucide-react";

interface ChatItem {
  title: string;
  messages: { text: string; isUser: boolean; date?: string }[];
}

const ChatPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [chats, setChats] = useState<ChatItem[]>([
    {
      title: "Bagaimana saya mengecek keaslian berita?",
      messages: [
        { text: "Bagaimana saya mengetahui keaslian berita?", isUser: true },
        {
          text: "Pertanyaan yang bagus! Periksa sumbernya terlebih dahulu.",
          isUser: false,
        },
      ],
    },
    {
      title: "Berita ini asli atau sekedar hoax?",
      messages: [
        { text: "Apakah berita ini hoax?", isUser: true },
        { text: "Mari kita periksa bersama.", isUser: false },
      ],
    },
  ]);

  const [activeChat, setActiveChat] = useState<number>(0);
  const [newMessage, setNewMessage] = useState<string>("");
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto close menu ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll otomatis ke bawah ketika pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChat]);

  // Close sidebar ketika klik di luar (mobile)
  useEffect(() => {
    const handleOutsideSidebar = (e: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      if (isSidebarOpen && sidebar && !sidebar.contains(e.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen)
      document.addEventListener("mousedown", handleOutsideSidebar);
    return () =>
      document.removeEventListener("mousedown", handleOutsideSidebar);
  }, [isSidebarOpen]);

  const handleSend = (): void => {
    if (!newMessage.trim()) return;

    const updated = [...chats];
    updated[activeChat].messages.push({ text: newMessage, isUser: true });
    setChats(updated);
    setNewMessage("");

    setTimeout(() => {
      updated[activeChat].messages.push({
        text: "Terima kasih! Saya akan bantu periksa.",
        isUser: false,
      });
      setChats([...updated]);
    }, 1000);
  };

  const handleNewChat = (): void => {
    const newChat: ChatItem = {
      title: `Obrolan ${chats.length + 1}`,
      messages: [],
    };
    setChats([...chats, newChat]);
    setActiveChat(chats.length);
  };

  const handleDeleteChat = (index: number) => {
    setChats((prev) => prev.filter((_, i) => i !== index));
    setMenuIndex(null);
  };

  const isOlderThan7Days = (chat: ChatItem): boolean => {
    if (chat.messages.length === 0) return false;
    const date = chat.messages[chat.messages.length - 1].date;
    if (!date) return false;
    const diff =
      (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
    return diff > 7;
  };

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
            onClick={() => setIsSidebarOpen(false)}
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
          {chats.map((chat, i) => (
            <div
              key={i}
              onClick={() => {
                setActiveChat(i);
                setIsSidebarOpen(false);
              }}
              className={`group relative flex flex-col px-3 py-3 rounded-md shadow-sm cursor-pointer transition ${
                i === activeChat
                  ? isDarkMode
                    ? "border-l-4 border-gray-400 bg-[#1B263B]"
                    : "border-l-4 border-gray-500 bg-gray-100"
                  : isDarkMode
                  ? "bg-[#0D1B2A] hover:bg-[#1E2A40]"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <img
                      src={isDarkMode ? chatLogoDark : chatLogo}
                      alt="Chat Icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p
                    className={`text-[clamp(1rem,1.05vw+0.9rem,0.9rem)] truncate 
                    max-w-[180px] sm:max-w-[280px] md:max-w-[350px] 
                    ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                  >
                    {chat.title}
                  </p>
                </div>

                <span
                  className={`font-bold cursor-pointer transition-opacity ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  } ${
                    menuIndex === i
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuIndex(menuIndex === i ? null : i);
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

              {menuIndex === i && (
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
                    onClick={() => handleDeleteChat(i)}
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
            <div className="bg-gray-300 w-10 h-10 rounded-full"></div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-white">Yohan Estetika</p>
            </div>
          </div>

          {/* Tombol kanan */}
          <div className="flex items-center space-x-3">
            {/* Tombol dark mode */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-gray-300 hover:text-white transition text-xl"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-200" />
              )}
            </button>

            {/* Titik tiga menu */}
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="text-gray-300 text-xl font-bold hover:text-white transition"
              title="Profile Menu"
            >
              ⋯
            </button>

            {/* Dropdown menu profil */}
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
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div
        className={`flex-1 flex flex-col transition-colors duration-300 ${
          isDarkMode ? "bg-[#172A3A]" : "bg-[#F7FAFC]"
        }`}
      >
        {/* Hamburger (mobile only) */}
        <div className="md:hidden flex items-center p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-700 dark:text-gray-200"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Pesan Chat */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col">
          {chats[activeChat]?.messages.length === 0 ? (
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
              {chats[activeChat].messages.map((msg, i) => (
                <ChatBubble
                  key={i}
                  text={msg.text}
                  isUser={msg.isUser}
                  isDarkMode={isDarkMode}
                />
              ))}
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
            }`}
          >
            <input
              type="text"
              placeholder="Tulis pesan di sini"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className={`flex-1 bg-transparent outline-none py-3 ${
                isDarkMode
                  ? "text-gray-100 placeholder-gray-400"
                  : "text-gray-700 placeholder-gray-500"
              }`}
            />
            <button
              onClick={handleSend}
              className="transition-transform duration-200 hover:scale-110"
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
