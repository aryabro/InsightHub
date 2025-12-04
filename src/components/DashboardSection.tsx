import React from 'react';
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
  TrendingUp,
  ExternalLink,
  Plus,
  MoreVertical
} from 'lucide-react';
import { FileUploader } from './FileUploader';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function DashboardSection() {
  const stats = [
    { label: 'Team Members', value: '24', icon: Users, color: 'from-primary to-primary/60' },
    { label: 'Documents', value: '156', icon: FileText, color: 'from-accent to-accent/60' },
    { label: 'AI Queries', value: '892', icon: MessageSquare, color: 'from-success to-success/60' },
    { label: 'Active Today', value: '18', icon: TrendingUp, color: 'from-warning to-warning/60' },
  ];

  const recentDocs = [
    { title: 'Q4 Product Roadmap', updated: '2 hours ago', author: 'Sarah Chen' },
    { title: 'API Documentation v2.1', updated: '5 hours ago', author: 'Mike Johnson' },
    { title: 'Design System Guidelines', updated: '1 day ago', author: 'Emma Wilson' },
  ];

  const teamMembers = [
    { name: 'Sarah Chen', role: 'Manager', timezone: 'PST', status: 'online' },
    { name: 'Mike Johnson', role: 'Developer', timezone: 'EST', status: 'online' },
    { name: 'Emma Wilson', role: 'Developer', timezone: 'GMT', status: 'away' },
    { name: 'Alex Kim', role: 'Developer', timezone: 'JST', status: 'offline' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your team today.
          </p>
        </div>
        <Button className="gap-2 rounded-xl bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Document
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6 rounded-2xl border-border shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <Button variant="ghost" size="icon" className="rounded-lg">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-muted-foreground mb-1">{stat.label}</p>
              <h2 className="text-foreground">{stat.value}</h2>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* About Card */}
        <Card className="p-6 rounded-2xl border-border shadow-sm">
          <h3 className="mb-4 flex items-center justify-between">
            About InsightHub
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </h3>
          <p className="text-muted-foreground mb-4">
            Your team's centralized knowledge hub. Collaborate on documents, connect with team members, 
            and get instant answers from our AI assistant.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <span className="text-muted-foreground">All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Last synced 5 min ago</span>
            </div>
          </div>
        </Card>

        {/* Recent Documents */}
        <Card className="p-6 rounded-2xl border-border shadow-sm">
          <h3 className="mb-4">Recent Documents</h3>
          <div className="space-y-3">
            {recentDocs.map((doc, index) => (
              <div key={index} className="p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-1">
                  <p className="flex-1 pr-2">{doc.title}</p>
                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{doc.author}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{doc.updated}</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 rounded-xl">
            View All Documents
          </Button>
        </Card>

        {/* AI Chat Preview */}
        <Card className="p-6 rounded-2xl border-border shadow-sm">
          <h3 className="mb-4">AI Assistant</h3>
          <div className="space-y-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
              <p className="text-muted-foreground mb-2">
                Ask me anything about your team
              </p>
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Quick suggestions:</p>
              <Button variant="outline" size="sm" className="w-full justify-start rounded-lg">
                What's our Q4 roadmap?
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start rounded-lg">
                Show API documentation
              </Button>
            </div>
          </div>
          <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90">
            Open AI Chat
          </Button>
        </Card>
      </div>

      {/* Team Members Section */}
      <Card className="p-6 rounded-2xl border-border shadow-sm">
        <h3 className="mb-4">Team Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="p-4 bg-secondary rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <Badge 
                  variant="outline" 
                  className={`
                    rounded-lg
                    ${member.status === 'online' ? 'border-success text-success' : ''}
                    ${member.status === 'away' ? 'border-warning text-warning' : ''}
                    ${member.status === 'offline' ? 'border-border text-muted-foreground' : ''}
                  `}
                >
                  {member.status}
                </Badge>
              </div>
              <p className="mb-1">{member.name}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="secondary" className="rounded-lg">
                  {member.role}
                </Badge>
                <Badge variant="secondary" className="rounded-lg">
                  {member.timezone}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Forms Showcase - Component Library */}
      <Card className="p-6 rounded-2xl border-border shadow-sm">
        <h3 className="mb-6">Component Library</h3>
        
        <Tabs defaultValue="forms" className="w-full">
          <TabsList className="mb-6 bg-secondary rounded-xl">
            <TabsTrigger value="forms" className="rounded-lg">Forms & Inputs</TabsTrigger>
            <TabsTrigger value="buttons" className="rounded-lg">Buttons</TabsTrigger>
            <TabsTrigger value="upload" className="rounded-lg">File Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forms" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="John Doe" className="rounded-xl" />
              </div>
              
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" placeholder="john@example.com" className="rounded-xl" />
              </div>
              
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input type="tel" placeholder="+1 (555) 000-0000" className="rounded-xl" />
              </div>
              
              <div className="space-y-2">
                <Label>Team Role</Label>
                <Select defaultValue="developer">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="product">Product Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select defaultValue="pst">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific (PST)</SelectItem>
                    <SelectItem value="est">Eastern (EST)</SelectItem>
                    <SelectItem value="gmt">Greenwich (GMT)</SelectItem>
                    <SelectItem value="cet">Central European (CET)</SelectItem>
                    <SelectItem value="jst">Japan (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Department</Label>
                <Select defaultValue="engineering">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="buttons" className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <Button className="rounded-xl bg-primary hover:bg-primary/90">
                  Primary Button
                </Button>
                <Button variant="secondary" className="rounded-xl">
                  Secondary Button
                </Button>
                <Button variant="outline" className="rounded-xl">
                  Outline Button
                </Button>
                <Button variant="ghost" className="rounded-xl">
                  Ghost Button
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button size="sm" className="rounded-lg bg-primary hover:bg-primary/90">
                  Small Button
                </Button>
                <Button size="lg" className="rounded-xl bg-primary hover:bg-primary/90">
                  Large Button
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button className="rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Gradient Button
                </Button>
                <Button variant="outline" className="rounded-xl border-success text-success hover:bg-success/10">
                  Success Button
                </Button>
                <Button variant="outline" className="rounded-xl border-warning text-warning hover:bg-warning/10">
                  Warning Button
                </Button>
                <Button variant="destructive" className="rounded-xl">
                  Destructive Button
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Users className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl">
                  <FileText className="w-5 h-5" />
                </Button>
                <Button size="icon" className="rounded-xl bg-primary hover:bg-primary/90">
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload">
            <FileUploader />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Status Badges */}
      <Card className="p-6 rounded-2xl border-border shadow-sm">
        <h3 className="mb-4">Status Indicators & Badges</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-lg bg-primary">Primary</Badge>
            <Badge variant="secondary" className="rounded-lg">Secondary</Badge>
            <Badge variant="outline" className="rounded-lg">Outline</Badge>
            <Badge variant="destructive" className="rounded-lg">Destructive</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-lg border-success text-success">
              Success
            </Badge>
            <Badge variant="outline" className="rounded-lg border-warning text-warning">
              Warning
            </Badge>
            <Badge variant="outline" className="rounded-lg border-accent text-accent">
              Info
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-lg">Manager</Badge>
            <Badge variant="secondary" className="rounded-lg">Developer</Badge>
            <Badge variant="secondary" className="rounded-lg">Designer</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-lg">PST</Badge>
            <Badge variant="secondary" className="rounded-lg">EST</Badge>
            <Badge variant="secondary" className="rounded-lg">GMT</Badge>
            <Badge variant="secondary" className="rounded-lg">CET</Badge>
            <Badge variant="secondary" className="rounded-lg">JST</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
