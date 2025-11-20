import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { Vendor, Message } from '../types';
import { createVendorChatSession, sendMessageStream } from '../services/geminiService';
import { SUGGESTED_PROMPTS } from '../constants';

interface ChatInterfaceProps {
  vendor: Vendor;
  onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ vendor, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session on mount
  useEffect(() => {
    try {
      const session = createVendorChatSession(vendor);
      setChatSession(session);
      
      // Initial greeting
      const initialMsg: Message = {
        id: 'init',
        role: 'model',
        text: `Hello! I'm your Sirion Agent for **${vendor.name}**. How can I help you with this contract today?`,
        timestamp: new Date()
      };
      setMessages([initialMsg]);
    } catch (error) {
      console.error("Failed to init chat", error);
    }
  }, [vendor]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !chatSession || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Placeholder for AI response while streaming
    const responseId = (Date.now() + 1).toString();
    const initialAiMsg: Message = {
      id: responseId,
      role: 'model',
      text: '',
      timestamp: new Date(),
      isStreaming: true
    };
    
    setMessages(prev => [...prev, initialAiMsg]);

    try {
      const stream = await sendMessageStream(chatSession, text);
      let fullText = '';

      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === responseId ? { ...msg, text: fullText } : msg
        ));
      }

      setMessages(prev => prev.map(msg => 
        msg.id === responseId ? { ...msg, isStreaming: false } : msg
      ));

    } catch (error) {
      console.error("Error sending message", error);
      setMessages(prev => prev.map(msg => 
        msg.id === responseId ? { ...msg, text: "I'm sorry, I encountered an error connecting to the Sirion network. Please try again.", isStreaming: false } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-teal-600 bg-teal-50 border-teal-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'danger': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'chart': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
      case 'shield': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
      case 'dollar': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'file': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${vendor.name === 'Honeywell' ? 'bg-slate-800' : 'bg-slate-800'}`}>
                  {vendor.logoInitials}
              </div>
              <div>
                  <h2 className="text-lg font-bold text-slate-800 leading-none">{vendor.name}</h2>
                  <p className="text-xs text-slate-500 mt-1">Contract Management Agent</p>
              </div>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="p-1.5 bg-green-100 rounded-full">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Contract</span>
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px]" title={vendor.contractFileName}>{vendor.contractFileName}</span>
                </div>
             </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download
             </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Chat Interface */}
        <div className="flex-1 flex flex-col border-r border-slate-200 bg-white min-w-0">
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-purple-600 text-white rounded-br-none' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      {msg.text.split('\n').map((line, i) => (
                          <p key={i} className={`min-h-[1rem] leading-relaxed ${msg.role === 'user' ? 'text-purple-50' : 'text-slate-700'}`}>
                              {line.startsWith('**') ? <strong className={msg.role === 'user' ? 'text-white' : 'text-slate-900'}>{line.replace(/\*\*/g, '')}</strong> : line}
                          </p>
                      ))}
                    </div>
                    {msg.isStreaming && (
                        <div className="mt-2 flex space-x-1 opacity-70">
                            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-150"></div>
                        </div>
                    )}
                    {msg.role === 'model' && !msg.isStreaming && (
                       <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wide">
                          <span>Sirion Agent</span>
                          <span>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                       </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts (Only if limited history) */}
            {messages.length < 3 && (
                <div className="px-6 py-3 bg-slate-50/30 border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <div className="flex space-x-2">
                        {SUGGESTED_PROMPTS.map((prompt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestionClick(prompt)}
                              className="px-3 py-1.5 bg-white border border-purple-200 text-purple-700 text-xs font-medium rounded-full hover:bg-purple-50 hover:border-purple-300 transition-all"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="relative">
                  <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                      placeholder="Ask about clauses, renewal terms, or risks..."
                      disabled={isLoading}
                      className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-slate-700 text-sm placeholder:text-slate-400"
                  />
                  <button 
                      onClick={() => handleSend(input)}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
                  >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
              </div>
            </div>
        </div>

        {/* Right Side: Insight Cards (Desktop) */}
        <div className="hidden lg:block w-[400px] bg-slate-50 p-6 overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-slate-900 font-bold text-lg">Performance Insights</h3>
                <span className="text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded border border-slate-200">Live Data</span>
            </div>

            <div className="space-y-4">
                {vendor.kpis.map((kpi) => (
                    <div key={kpi.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                                {getIcon(kpi.icon || '')}
                                <span>{kpi.label}</span>
                            </div>
                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(kpi.status)}`}>
                                {kpi.status}
                            </div>
                        </div>
                        <div className="flex items-end justify-between mt-3">
                            <span className="text-2xl font-bold text-slate-800">{kpi.value}</span>
                            {kpi.trend && (
                                <span className={`text-xs font-medium flex items-center ${kpi.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                    {kpi.trend.startsWith('+') ? '↑' : '↓'} {kpi.trend.replace(/[+-]/, '')}
                                </span>
                            )}
                        </div>
                        <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                             <div 
                                className={`h-full rounded-full ${kpi.status === 'good' ? 'bg-teal-500' : kpi.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} 
                                style={{ width: kpi.status === 'good' ? '95%' : kpi.status === 'warning' ? '70%' : '40%' }}
                             ></div>
                        </div>
                    </div>
                ))}

                {/* Additional Quick Action Card */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg mt-6">
                    <h4 className="font-bold text-lg mb-2">Contract Action</h4>
                    <p className="text-purple-100 text-sm mb-4 opacity-90">
                        {vendor.status === 'Active' 
                           ? 'Schedule the upcoming Quarterly Business Review.' 
                           : 'Initiate risk mitigation protocol for this account.'}
                    </p>
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm">
                        {vendor.status === 'Active' ? 'Schedule QBR' : 'View Risk Report'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};