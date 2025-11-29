import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Clock, 
  Edit,
  Plus,
  Search,
  Slack,
  Mail,
  Globe,
  Filter,
  Send
} from 'lucide-react';

interface TeamDashboardProps {
  onNavigate?: (page: string) => void;
  onUploadDocument?: () => void;
}

export function TeamDashboard({ onNavigate, onUploadDocument }: TeamDashboardProps) {
  const [chatInput, setChatInput] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const teamInfo = {
    name: 'Mobile App Team',
    description: 'Building iOS and Android applications for customer-facing products. Our mission is to deliver exceptional mobile experiences that delight users.',
    contactPoints: {
      slack: '#mobile-team',
      email: 'mobile-team@company.com'
    },
    standupTime: '10:00 AM',
    timezone: 'PST',
    memberTimezones: ['PST', 'EST', 'GMT']
  };

  const teamMembers = [
    { name: 'Sarah Chen', role: 'Manager', timezone: 'PST', status: 'online', avatar: 'SC' },
    { name: 'Mike Johnson', role: 'Developer', timezone: 'EST', status: 'online', avatar: 'MJ' },
    { name: 'Emma Wilson', role: 'Developer', timezone: 'GMT', status: 'away', avatar: 'EW' },
    { name: 'Alex Kim', role: 'Developer', timezone: 'JST', status: 'online', avatar: 'AK' },
  ];

  const documents = [
    { 
      title: 'API Documentation v2.1', 
      tag: 'API Spec',
      owner: 'Mike Johnson', 
      lastUpdated: '5 hours ago',
      color: 'from-primary to-primary/60'
    },
    { 
      title: 'Design System Guidelines', 
      tag: 'Design Doc',
      owner: 'Emma Wilson', 
      lastUpdated: '1 day ago',
      color: 'from-accent to-accent/60'
    },
    { 
      title: 'Deployment Runbook', 
      tag: 'Runbook',
      owner: 'Alex Kim', 
      lastUpdated: '2 days ago',
      color: 'from-success to-success/60'
    },
  ];

  const chatHistory = [
    {
      type: 'assistant',
      message: 'Hello! I can help you find information from your team\'s documents. What would you like to know?',
      time: '10:30 AM'
    },
    {
      type: 'user',
      message: 'What\'s our deployment process?',
      time: '10:31 AM'
    },
    {
      type: 'assistant',
      message: 'Based on the Deployment Runbook, here are the key steps:\n\n1. Run tests locally\n2. Create a pull request\n3. Get approval from at least one reviewer\n4. Deploy to staging\n5. Run smoke tests\n6. Deploy to production',
      time: '10:31 AM',
      source: 'Deployment Runbook'
    }
  ];

  const filteredDocs = selectedTag === 'all' 
    ? documents 
    : documents.filter(doc => doc.tag === selectedTag);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">{teamInfo.name}</h1>
          <p className="text-muted-foreground">
            Your team's central knowledge hub
          </p>
        </div>
      </div>

      {/* Top Row - About & Standup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* About Card */}
        <Card className="p-6 rounded-2xl border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3>About</h3>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-muted-foreground mb-6">
            {teamInfo.description}
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Slack className="w-5 h-5 flex-shrink-0" />
              <span>{teamInfo.contactPoints.slack}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{teamInfo.contactPoints.email}</span>
            </div>
          </div>
        </Card>

        {/* Standup Card */}
        <Card className="p-6 rounded-2xl border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3>Daily Standup</h3>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl">{teamInfo.standupTime}</span>
              <Badge variant="secondary" className="rounded-lg">
                {teamInfo.timezone}
              </Badge>
            </div>
            <p className="text-muted-foreground">Next standup in 2 hours</p>
          </div>

          <div className="p-4 bg-secondary rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Team time zones</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {teamInfo.memberTimezones.map((tz, index) => (
                <Badge key={index} variant="outline" className="rounded-lg">
                  {tz}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members Card */}
        <Card className="p-6 rounded-2xl border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3>Members</h3>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white flex-shrink-0">
                  <span>{member.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate">{member.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-lg text-xs">
                      {member.role}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{member.timezone}</span>
                  </div>
                </div>
                <div className={`
                  w-2 h-2 rounded-full flex-shrink-0
                  ${member.status === 'online' ? 'bg-success' : ''}
                  ${member.status === 'away' ? 'bg-warning' : ''}
                  ${member.status === 'offline' ? 'bg-border' : ''}
                `}></div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 rounded-xl">
            View All Members
          </Button>
        </Card>

        {/* Documents Card */}
        <Card className="p-6 rounded-2xl border-border shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3>Documents</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-lg"
                onClick={() => setSelectedTag('all')}
              >
                <Filter className="w-4 h-4" />
              </Button>
              <Button 
                className="rounded-xl bg-primary hover:bg-primary/90 gap-2"
                onClick={onUploadDocument}
              >
                <Plus className="w-4 h-4" />
                Upload
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTag}>
            <TabsList className="mb-4 bg-secondary rounded-xl">
              <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
              <TabsTrigger value="Design Doc" className="rounded-lg">Design Doc</TabsTrigger>
              <TabsTrigger value="API Spec" className="rounded-lg">API Spec</TabsTrigger>
              <TabsTrigger value="Runbook" className="rounded-lg">Runbook</TabsTrigger>
            </TabsList>

            <div className="space-y-2">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc, index) => (
                  <div
                    key={index}
                    className="p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer"
                    onClick={() => onNavigate?.('document-detail')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${doc.color} flex items-center justify-center flex-shrink-0`}>
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate mb-1">{doc.title}</p>
                          <Badge variant="outline" className="rounded-lg">
                            {doc.tag}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground ml-13">
                      <span>{doc.owner}</span>
                      <span>•</span>
                      <span>{doc.lastUpdated}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No documents in this category</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search documents..." 
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
          </Tabs>
        </Card>
      </div>

      {/* AI Chat Panel */}
      <Card className="rounded-2xl border-border shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Chat Area */}
          <div className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3>AI Assistant</h3>
                  <p className="text-muted-foreground">
                    Ask questions about your team's docs
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="rounded-xl"
                onClick={() => onNavigate?.('chat')}
              >
                Open Full Chat
              </Button>
            </div>

            <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${msg.type === 'assistant' 
                      ? 'bg-gradient-to-br from-primary to-accent' 
                      : 'bg-secondary'
                    }
                  `}>
                    {msg.type === 'assistant' ? (
                      <MessageSquare className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-foreground">U</span>
                    )}
                  </div>

                  <div className={`flex-1 ${msg.type === 'user' ? 'flex justify-end' : ''}`}>
                    <div className={`
                      max-w-[80%] rounded-xl p-3
                      ${msg.type === 'assistant' 
                        ? 'bg-secondary' 
                        : 'bg-primary text-primary-foreground'
                      }
                    `}>
                      <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                      {msg.source && (
                        <Badge variant="outline" className="rounded-lg mt-2">
                          <FileText className="w-3 h-3 mr-1" />
                          {msg.source}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything about your team's knowledge..."
                className="rounded-xl"
              />
              <Button 
                size="icon"
                className="rounded-xl bg-primary hover:bg-primary/90"
                onClick={() => setChatInput('')}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Citations Area */}
          <div className="p-6">
            <h3 className="mb-4">Knowledge Base</h3>
            <p className="text-muted-foreground mb-6">
              Answers are sourced from your team's uploaded documents and knowledge base.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Active Sources</span>
                </div>
                <p className="text-muted-foreground">
                  {documents.length} documents indexed
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Recent Sources</Label>
                {documents.slice(0, 3).map((doc, index) => (
                  <div key={index} className="p-2 bg-secondary rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-primary" />
                      <span className="truncate">{doc.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
