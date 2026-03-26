"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err: any) {
      setError(err.message || 'Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Digital Detox Chatbot
            </h1>
            <p className="text-gray-400 mt-2">Your empathetic companion for healthy gaming habits.</p>
          </motion.div>

          {/* Empty state */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                <span className="text-5xl">🤖</span>
              </div>
              <p className="text-xl font-semibold text-gray-200 mb-3">Hello there! 👋</p>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                I&apos;m your digital wellness AI therapist. How has your gaming been going lately? I&apos;m here to listen and help.
              </p>
              {/* Quick starter prompts */}
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  "I've been gaming too much lately",
                  "I need help balancing my time",
                  "I feel anxious when I'm not gaming",
                  "How do I reduce my screen time?"
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-sm text-gray-300 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <div className="space-y-5 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm shrink-0 mr-3 mt-1 shadow-lg">
                      🤖
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-5 py-3 max-w-[80%] shadow-lg text-sm lg:text-base leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
                        : 'bg-white/10 backdrop-blur-md border border-white/15 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm shrink-0 mr-3 mt-1">
                  🤖
                </div>
                <div className="rounded-2xl px-5 py-4 bg-white/10 border border-white/10 rounded-bl-none flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-3 px-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-md mx-auto"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 p-4 bg-gray-900/80 backdrop-blur-xl border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex max-w-3xl mx-auto gap-3">
          <input
            className="flex-1 bg-white/10 border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition placeholder-gray-500"
            value={input}
            placeholder="Share what's on your mind..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
          >
            Send ✈️
          </button>
        </form>
      </div>
    </div>
  );
}
