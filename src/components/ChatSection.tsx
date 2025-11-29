import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MessageSquare, Send, Sparkles, User, Bot, Lock, Info } from 'lucide-react';

export function ChatSection() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI assistant. I can help you find documents, answer questions about your team, and provide insights from your knowledge base.",
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      type: 'user',
      content: "What's our Q4 product roadmap?",
      timestamp: '10:31 AM'
    },
    {
      id: 3,
      type: 'bot',
      content: "Based on the Q4 Product Roadmap document by Sarah Chen, here are the key initiatives:\n\n1. Launch of API v2.1 with enhanced security\n2. Mobile app redesign\n3. Integration with third-party tools\n4. Performance optimization\n\nWould you like me to provide more details on any of these items?",
      timestamp: '10:31 AM',
      source: 'Q4 Product Roadmap'
    },
  ]);

  const [inputValue, setInputValue] = useState('');

  const quickPrompts = [
    "Show me the design system guidelines",
    "Who's on the engineering team?",
    "What's the latest API documentation?",
    "Summarize today's standup notes"
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: "I understand your question. Based on the documents in your team's knowledge base, I can help you with that. However, this is a demo response. In a production environment, I would analyze your uploaded documents and provide specific, cited answers.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        source: 'Team Knowledge Base'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
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
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
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
                    className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20 h-12 w-12"
                  >
                    <Send className="w-5 h-5" />
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
                  The AI searches through your team's uploaded documents to provide accurate, cited answers to your questions.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
