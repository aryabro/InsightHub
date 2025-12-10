import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Send, Sparkles, User, Bot, Lock, Info, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getAuthHeader } from '../api/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export type ChatMessage = {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  source?: string;
};

interface ChatSectionProps {
  teamId?: string;
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
}

const getInitialMessage = (): ChatMessage => ({
  id: 1,
  type: 'bot',
  content: "Hello! I'm your AI assistant powered by Google Gemini. Ask me anything about your team's documents!",
  timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
});

export function ChatSection({ teamId, messages, onMessagesChange }: ChatSectionProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "Show me the design system guidelines",
    "Who's on the engineering team?",
    "What's the latest API documentation?",
    "Summarize today's standup notes"
  ];

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
    
    // Add user message immediately
    const updatedMessagesWithUser = [...messages, userMessage];
    onMessagesChange(updatedMessagesWithUser);
    
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Call the backend API
      // Only send actual user/bot messages, exclude the greeting
      const chatHistory = updatedMessagesWithUser.slice(1).filter(msg => msg.content && msg.content.trim());
      
      // Use relative path in development (vite proxy), full URL in production
      const chatUrl = import.meta.env.DEV ? '/api/chat' : `${API_BASE}/api/chat`;
      
      console.log('Sending chat request to:', chatUrl);
      console.log('Message:', currentInput);
      console.log('History length:', chatHistory.length);
      console.log('Team ID:', teamId);
      
      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        } as HeadersInit,
        body: JSON.stringify({
          message: currentInput,
          history: chatHistory,
          teamId: teamId // Pass teamId for RAG
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        // Create error object with status and details for better handling
        const error = new Error(errorData.error || errorData.message || `Server error: ${response.status}`) as any;
        error.status = response.status;
        error.details = errorData.details || errorData.error || '';
        throw error;
      }

      const data = await response.json();
      
      // Only add the response if it's not empty
      if (data.response && data.response.trim()) {
        const aiResponse = {
          id: updatedMessagesWithUser.length + 1,
          type: 'bot' as const,
          content: data.response,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          source: data.sources && data.sources.length > 0 ? `Based on: ${data.sources.slice(0, 2).join(', ')}${data.sources.length > 2 ? '...' : ''}` : undefined
        };
        
        onMessagesChange([...updatedMessagesWithUser, aiResponse]);
      } else {
        // If blank response, show error message instead
        const errorMessage = {
          id: updatedMessagesWithUser.length + 1,
          type: 'bot' as const,
          content: "I received an empty response. Please try rephrasing your question.",
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        onMessagesChange([...updatedMessagesWithUser, errorMessage]);
      }
    } catch (error: any) {
      console.error('Error calling chat API:', error);
      let errorContent = "I'm sorry, I encountered an error while processing your request.";
      
      // Handle specific error types
      if (error.status === 500) {
        // Check if it's a quota/quota exceeded error
        const errorDetails = error.details || error.message || '';
        if (errorDetails.includes('quota') || errorDetails.includes('Quota exceeded') || errorDetails.includes('429')) {
          errorContent = "I've reached my daily request limit. The free tier allows 20 requests per day. Please try again tomorrow or upgrade your API plan. Sorry for the inconvenience!";
        } else if (errorDetails.includes('rate limit') || errorDetails.includes('rate-limit')) {
          errorContent = "I'm being rate limited. Please wait a moment and try again.";
        } else {
          errorContent = "The AI service is temporarily unavailable. Please try again in a few moments.";
        }
      } else if (error.status === 400) {
        errorContent = "There was an issue with your request. Please try rephrasing your question.";
      } else if (error.status === 401 || error.status === 403) {
        errorContent = "You're not authorized to use this feature. Please log in again.";
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorContent = "Unable to connect to the server. Please make sure the backend server is running and try again.";
      } else if (error.message) {
        errorContent = `Error: ${error.message}`;
      } else {
        errorContent += " Please try again or check the console for more details.";
      }
      
      const errorMessage = {
        id: updatedMessagesWithUser.length + 1,
        type: 'bot' as const,
        content: errorContent,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      onMessagesChange([...updatedMessagesWithUser, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">AI Chat</h1>
          <p className="text-slate-600">
            Ask questions about your team's documents and knowledge base
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <Card className="p-4 rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="mb-1">Private & Secure</p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Only you can view your chat history. All conversations are private and never shared with other team members.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="rounded-3xl border-border shadow-xl bg-card overflow-hidden">
            <div className="h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md
                      ${message.type === 'bot' 
                        ? 'bg-gradient-to-br from-primary to-accent' 
                        : 'bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200'
                      }
                    `}>
                      {message.type === 'bot' ? (
                        <Bot className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    <div className={`flex-1 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                      <div className={`
                        max-w-[85%] rounded-2xl p-5 shadow-sm
                        ${message.type === 'bot' 
                          ? 'bg-gradient-to-br from-slate-50 to-white border border-slate-200' 
                          : 'bg-gradient-to-br from-primary to-primary/90 text-white'
                        }
                      `}>
                        <div className="prose prose-sm max-w-none leading-relaxed break-words dark:prose-invert">
                          <ReactMarkdown
                            components={{
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                              a: ({node, ...props}) => <a className="underline hover:text-blue-500" target="_blank" rel="noopener noreferrer" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                              li: ({node, ...props}) => <li className="mb-1" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        {message.source && (
                          <Badge variant="outline" className="rounded-lg mt-3 border-primary/20 bg-white/50">
                            <Sparkles className="w-3 h-3 mr-1.5 text-primary" />
                            {message.source}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-2 px-2">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md bg-gradient-to-br from-primary to-accent">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="max-w-[85%] rounded-2xl p-5 shadow-sm bg-gradient-to-br from-slate-50 to-white border border-slate-200">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          <p className="text-slate-600">Thinking...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                <div className="flex gap-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything about your team's knowledge..."
                    className="flex-1 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 h-12"
                  />
                  <Button 
                    onClick={handleSend}
                    size="icon"
                    disabled={isLoading}
                    className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20 h-12 w-12 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl border-border shadow-lg bg-card">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3>Quick Prompts</h3>
            </div>
            <div className="space-y-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 hover:border-primary/20 border-border"
                  onClick={() => setInputValue(prompt)}
                >
                  <span className="text-sm line-clamp-2">{prompt}</span>
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-6 rounded-3xl border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 via-indigo-50/30 to-teal-50/30">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="mb-2">How it works</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Powered by Google Gemini AI. Ask questions, get code help, brainstorm ideas, or have a conversation!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
