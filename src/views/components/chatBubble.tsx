import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

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
        className={`px-4 py-2 rounded-lg mb-2 break-words text-[0.9rem] sm:text-base mx-3 sm:mx-10 transition-all duration-300 ease-out transform
          ${isUser ? "animate-fadeInRight" : "animate-fadeInLeft"}
          ${
            isUser
              ? "bg-[#345A66] text-white self-end max-w-[85%] sm:max-w-[70%] rounded-br-none"
              : isDarkMode
              ? "text-gray-100 font-medium max-w-[85%] sm:max-w-[70%] text-justify leading-relaxed"
              : "text-[#172A3A] font-medium max-w-[85%] sm:max-w-[70%] text-justify leading-relaxed"
          }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            // Custom styling for markdown elements
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-3 mt-2">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold mb-2 mt-2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-bold mb-2 mt-1">{children}</h3>
            ),
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-2 ml-2 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-2 ml-2 space-y-1">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="ml-2">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote
                className={`border-l-4 pl-4 py-2 my-2 italic ${
                  isDarkMode
                    ? "border-gray-500 bg-gray-800"
                    : "border-gray-400 bg-gray-100"
                }`}
              >
                {children}
              </blockquote>
            ),
            code: ({ className, children }) => {
              const isInline = !className;
              return isInline ? (
                <code
                  className={`px-1.5 py-0.5 rounded font-mono text-sm ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {children}
                </code>
              ) : (
                <code
                  className={`block p-3 rounded font-mono text-sm overflow-x-auto ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="mb-2 overflow-x-auto">{children}</pre>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline hover:opacity-80 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {children}
              </a>
            ),
            strong: ({ children }) => (
              <strong className="font-bold">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            hr: () => (
              <hr
                className={`my-3 ${
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              />
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-2">
                <table
                  className={`min-w-full border ${
                    isDarkMode ? "border-gray-600" : "border-gray-300"
                  }`}
                >
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-200"}>
                {children}
              </thead>
            ),
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => (
              <tr
                className={`border-b ${
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              >
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="px-4 py-2 text-left font-bold">{children}</th>
            ),
            td: ({ children }) => <td className="px-4 py-2">{children}</td>,
          }}
        >
          {text}
        </ReactMarkdown>
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
