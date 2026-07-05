import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isBot = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot ? 'bg-emerald-500/20' : 'bg-blue-500/20'
      }`}>
        {isBot ? (
          <Bot className="w-4 h-4 text-emerald-400" />
        ) : (
          <User className="w-4 h-4 text-blue-400" />
        )}
      </div>
      <div className={`flex-1 max-w-[85%] ${isBot ? '' : 'text-right'}`}>
        <div className={`inline-block rounded-2xl px-4 py-3 ${
          isBot 
            ? 'bg-gray-800 border border-gray-700/50 text-left' 
            : 'bg-blue-600 text-white'
        }`}>
          {isBot ? (
            <ReactMarkdown 
              className="text-sm text-gray-200 prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                strong: ({ children }) => <strong className="text-emerald-400 font-semibold">{children}</strong>,
                code: ({ children }) => <code className="bg-gray-900 px-1 rounded text-emerald-300">{children}</code>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="text-sm">{message.content}</p>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1 px-2">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}