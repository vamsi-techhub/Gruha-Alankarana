import React, { useState, useRef, useEffect } from 'react';
import { chatWithAgent, generateSpeech } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, User, Bot, Volume2, Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const ChatAgent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Namaste! I am Buddy, your interior design assistant. I can help you find furniture, suggest styles, or book a consultation. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithAgent(history, userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      
      // Auto-generate speech for the latest response
      playSpeech(responseText);

    } catch (e) {
      console.error(e);
      // Error handling UI could go here
    } finally {
      setIsTyping(false);
    }
  };

  const playSpeech = async (text: string) => {
    if (isPlayingAudio) {
        audioRef.current?.pause();
        setIsPlayingAudio(false);
        return;
    }
    try {
      const audioBase64 = await generateSpeech(text);
      if (audioBase64) {
        const audioSrc = `data:audio/mp3;base64,${audioBase64}`;
        if (audioRef.current) {
          audioRef.current.src = audioSrc;
          audioRef.current.play();
          setIsPlayingAudio(true);
          audioRef.current.onended = () => setIsPlayingAudio(false);
        }
      }
    } catch (e) {
      console.error("Speech play error", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col p-4">
      <div className="bg-slate-900 flex-1 rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
               <Bot className="text-white w-6 h-6" />
             </div>
             <div>
               <h3 className="font-bold text-slate-200">Buddy</h3>
               <p className="text-xs text-amber-500">AI Design Assistant</p>
             </div>
           </div>
           <audio ref={audioRef} className="hidden" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === 'user' ? 'bg-slate-700' : 'bg-amber-600'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-slate-700 text-white rounded-tr-sm' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
              }`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                {msg.role === 'model' && (
                  <button 
                    onClick={() => playSpeech(msg.text)}
                    className="mt-2 text-slate-500 hover:text-amber-500 transition-colors flex items-center gap-1 text-xs"
                  >
                    <Volume2 className="w-3 h-3" /> {isPlayingAudio ? 'Stop' : 'Listen'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about furniture, styles, or booking..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-2 p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};