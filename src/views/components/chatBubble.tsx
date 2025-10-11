import React from "react";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
  text: string;
  isUser: boolean;
  isDarkMode?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  text,
  isUser,
  isDarkMode,
}) => {
  return (
    <div
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full`}
    >
      {/* Garis atas untuk pesan bot (penuh lebar) */}
      {!isUser && (
        <hr
          className={`w-full mb-3 ${
            isDarkMode ? "border-gray-600" : "border-gray-300"
          }`}
        />
      )}

      {/* Bubble pesan */}
      <div
        className={`px-4 py-2 rounded-lg mb-2 break-words text-[0.9rem] sm:text-base mx-3 sm:mx-10
          ${
            isUser
              ? "bg-[#345A66] text-white self-end max-w-[85%] sm:max-w-[70%]"
              : isDarkMode
              ? "text-gray-100 font-semibold max-w-[85%] sm:max-w-[70%]"
              : "text-[#172A3A] font-semibold max-w-[85%] sm:max-w-[70%]"
          }`}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>

      {/* Garis bawah untuk pesan bot (penuh lebar) */}
      {!isUser && (
        <hr
          className={`w-full mt-3 ${
            isDarkMode ? "border-gray-600" : "border-gray-300"
          }`}
        />
      )}
    </div>
  );
};

export default ChatBubble;
