import React, { useState, useRef, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { MessageSquare, Send, X, Bot, Sparkles, TrendingUp, AlertCircle, RefreshCw, Key, Settings, Trash2 } from 'lucide-react';
import { CURRENCIES } from '../constants/currencies';
const formatMessageText = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, lineIdx) => {
        let trimmed = line.trim();
        const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ');
        if (isBullet) {
          trimmed = trimmed.replace(/^(\*\s*|-\s*|•\s*)/, '');
        }

        // Parse bold text **text** -> <strong>
        const parts = [];
        const boldRegex = /\*\*(.*?)\*\*/g;
        let match;
        let lastIdx = 0;
        while ((match = boldRegex.exec(trimmed)) !== null) {
          if (match.index > lastIdx) {
            parts.push(trimmed.substring(lastIdx, match.index));
          }
          parts.push(<strong key={match.index} className="font-extrabold text-slate-100">{match[1]}</strong>);
          lastIdx = boldRegex.lastIndex;
        }
        if (lastIdx < trimmed.length) {
          parts.push(trimmed.substring(lastIdx));
        }

        const content = parts.length > 0 ? parts : trimmed;

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-1">
              <span className="text-sky-400 shrink-0 select-none mt-1">•</span>
              <span className="flex-1">{content}</span>
            </div>
          );
        }

        return (
          <div key={lineIdx} className={line === '' ? 'h-2' : ''}>
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default function Chatbot() {
  const { state } = useExpenses();
  const { expenses, currency } = state;
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(
    import.meta.env.VITE_GEMINI_API_KEY || 
    localStorage.getItem('expensense_gemini_api_key') || 
    ''
  );
  const [tempKey, setTempKey] = useState('');
  const [showSettings, setShowSettings] = useState(!apiKey);
  
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I'm ExpenBot, your personal AI financial assistant. I can analyze your transactions, calculate your savings rate, summarize your spending, or provide budget tips using Gemini. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Keep showSettings in sync when key changes
  useEffect(() => {
    setShowSettings(!apiKey);
  }, [apiKey]);

  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showSettings]);

  // Compute stats from current expense data
  const getFinancialStats = () => {
    const totalIncome = expenses
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + Number(e.amount), 0);
      
    const totalExpense = expenses
      .filter(e => e.type === 'expense' || !e.type)
      .reduce((sum, e) => sum + Number(e.amount), 0);
      
    const netBalance = totalIncome - totalExpense;
    
    const savingsRate = totalIncome > 0 
      ? Math.round((netBalance / totalIncome) * 100) 
      : 0;

    const categoryTotals = {};
    expenses.forEach(e => {
      const type = e.type || 'expense';
      if (type === 'expense') {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
      }
    });

    let topCategory = 'None';
    let topAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > topAmount) {
        topAmount = amt;
        topCategory = cat;
      }
    });

    // Recent transactions serialized
    const serializedTransactions = expenses.map(e => ({
      type: e.type || 'expense',
      amount: Number(e.amount),
      category: e.category,
      date: e.date,
      note: e.note || ''
    }));

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      categoryTotals,
      topCategory,
      topAmount,
      transactions: serializedTransactions
    };
  };

  const callGeminiApi = async (userMsg, key) => {
    const stats = getFinancialStats();
    const activeCurrency = CURRENCIES[currency] || CURRENCIES.INR;
    
    const systemPrompt = `You are ExpenBot, a professional personal financial advisor built into the "ExpenSense" expense tracking app.
Your job is to help users understand their spending habits, analyze their ledger, calculate financial metrics, and give practical, encouraging financial advice.

Guidelines:
- Keep your answers concise, professional, and directly useful.
- Use clear formatting with bullet points and bold text where appropriate.
- Refer directly to the user's transaction data below to answer their questions.
- If they ask about specific categories or summaries, do the math based on the data.
- Do not make up transactions that do not exist.
- Keep your response under 150 words unless detail is specifically requested.
- Always use the currency symbol (${activeCurrency.symbol}) and currency code (${activeCurrency.code}) for all monetary values.
- Today's local date is: ${new Date().toISOString().split('T')[0]}.

User's Transaction Ledger Data (Today's Transactions):
- Net Balance: ${activeCurrency.symbol}${stats.netBalance.toFixed(2)}
- Total Income: ${activeCurrency.symbol}${stats.totalIncome.toFixed(2)}
- Total Expenses: ${activeCurrency.symbol}${stats.totalExpense.toFixed(2)}
- Savings Rate: ${stats.savingsRate}%
- Top Category: ${stats.topCategory} (${activeCurrency.symbol}${stats.topAmount.toFixed(2)})
- Full Transaction List: ${JSON.stringify(stats.transactions)}

(Note: transaction type is either "income" or "expense". Category is one of Food, Transport, Shopping, Bills, Health, Entertainment, Other.)
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nUser Question: "${userMsg}"`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 400
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errMsg = errorData.error?.message || `HTTP error ${response.status}`;
      const err = new Error(errMsg);
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) {
      throw new Error("No response from Gemini API candidates.");
    }

    return replyText;
  };

  const handleSend = async (textToSend) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim()) return;

    // Check key before sending
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    
    // Show typing bubble
    setIsTyping(true);

    try {
      const botResponseText = await callGeminiApi(messageText, apiKey);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponseText,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      setIsTyping(false);
      console.error("Gemini API Error:", err);
      
      let errorMsg = "Sorry, I couldn't reach the Gemini AI service. Please try again later.";
      if (err.status === 429 || err.message.toLowerCase().includes('quota') || err.message.toLowerCase().includes('rate limit') || err.message.toLowerCase().includes('limit exceeded')) {
        errorMsg = "⚠️ **Quota Exceeded.** You have hit the Gemini API rate limit or daily free tier limit. Please wait a moment or try again later.";
      } else if (err.status === 400 || err.status === 403 || err.message.includes('API_KEY_INVALID') || err.message.toLowerCase().includes('api key')) {
        errorMsg = "🔴 **Invalid API Key.** Please verify your Gemini API key in the settings panel.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: errorMsg,
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleSaveKey = () => {
    if (tempKey.trim()) {
      localStorage.setItem('expensense_gemini_api_key', tempKey.trim());
      setApiKey(tempKey.trim());
      setTempKey('');
      setShowSettings(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('expensense_gemini_api_key');
    setApiKey('');
    setTempKey('');
    setShowSettings(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const quickActions = [
    { label: '📊 Summary', prompt: 'Summarize my spending and net balance.' },
    { label: '💡 Saving Tips', prompt: 'Based on my transactions, give me some saving tips.' },
    { label: '💸 Savings Profile', prompt: 'Analyze my savings rate and list my totals.' },
    { label: '📈 Top Category', prompt: 'What is my highest spending category and total?' }
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 text-slate-950 shadow-[0_8px_30px_rgb(56,189,248,0.2)] hover:shadow-[0_8px_30px_rgb(56,189,248,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none group border-none cursor-pointer"
        aria-label="Toggle financial advisor chatbot"
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
        ) : (
          <MessageSquare className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
        )}
        <span className="absolute right-16 bg-slate-900 text-slate-100 text-xs px-2.5 py-1 rounded-md border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
          Ask ExpenBot Advisor
        </span>
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-120px)] bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8.5 w-8.5 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 relative">
                <Bot className="h-4.5 w-4.5" />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-slate-950 animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5 leading-none">
                  ExpenBot
                  <Sparkles className="h-3 w-3 text-amber-400 fill-amber-400" />
                </div>
                <span className="text-[10px] font-medium text-slate-450 mt-1 block">ExpenSense Advisor</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-colors border-none bg-transparent cursor-pointer ${
                  showSettings ? 'text-sky-400 hover:text-sky-350' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="API Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Settings Screen */}
          {showSettings ? (
            <div className="flex-1 p-6 flex flex-col justify-center space-y-4 bg-slate-900/40">
              <div className="text-center space-y-2">
                <div className="mx-auto h-12 w-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400">
                  <Key className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-100">Gemini API Key Required</h3>
                <p className="text-xs text-slate-400 max-w-[280px] mx-auto">
                  To power the AI financial advisor, please enter your Gemini API key. Keys are saved locally in your browser.
                </p>
              </div>

              <div className="space-y-3">
                {apiKey ? (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs text-slate-350 font-semibold font-mono">••••••••••••••••</span>
                    </div>
                    <button
                      onClick={handleClearKey}
                      className="p-1 text-rose-450 hover:bg-rose-500/15 rounded-lg border-none bg-transparent cursor-pointer transition-colors"
                      title="Clear API Key"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="password"
                      value={tempKey}
                      onChange={e => setTempKey(e.target.value)}
                      placeholder="Paste your Gemini API key..."
                      className="w-full bg-slate-950 text-xs text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
                    />
                    <button
                      onClick={handleSaveKey}
                      disabled={!tempKey.trim()}
                      className="w-full py-2.5 bg-sky-400 hover:bg-sky-350 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-xl border-none cursor-pointer transition-all active:scale-[0.98]"
                    >
                      Save API Key
                    </button>
                  </div>
                )}

                <div className="text-center">
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-sky-450 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    Get a free API key from Google AI Studio &rarr;
                  </a>
                </div>
              </div>

              {apiKey && (
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full py-2 bg-slate-850 hover:bg-slate-800 text-xs text-slate-300 font-bold rounded-xl border border-slate-800 cursor-pointer transition-colors"
                >
                  Return to Chat
                </button>
              )}
            </div>
          ) : (
            /* Chat Interface Screen */
            <>
              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 max-w-[85%] ${
                      msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="h-7 w-7 rounded-md bg-slate-850 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-slate-950 font-semibold shadow-md rounded-tr-none'
                          : 'bg-slate-850/80 border border-slate-800 text-slate-250 rounded-tl-none font-medium'
                      }`}
                    >
                      {formatMessageText(msg.text)}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="h-7 w-7 rounded-md bg-slate-850 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                      <Bot className="h-3.5 w-3.5 animate-bounce" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-slate-850/80 border border-slate-800 text-slate-400 rounded-tl-none flex items-center gap-2">
                      <span className="text-xs italic font-medium animate-pulse text-slate-400">working...</span>
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions Panel */}
              <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/40 overflow-x-auto flex gap-2 no-scrollbar scroll-smooth">
                {quickActions.map(action => (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.prompt)}
                    className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-[10px] font-bold text-slate-300 rounded-full border border-slate-800 transition-all hover:scale-105 active:scale-[0.95] whitespace-nowrap cursor-pointer hover:border-slate-700 hover:text-slate-100"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Input Panel */}
              <div className="p-3 bg-slate-950 border-t border-slate-800/60 flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask ExpenBot about your ledger..."
                  className="flex-1 bg-slate-900/60 text-xs text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
                />
                <button
                  onClick={() => handleSend()}
                  className="p-2.5 bg-sky-400 hover:bg-sky-300 text-slate-950 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center shrink-0 border-none cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          )}

        </div>
      )}
    </>
  );
}
