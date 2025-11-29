import React from 'react';
import { Home, Users, FileText, MessageSquare, Settings, ChevronRight, Smartphone } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'about', label: 'About', icon: Home },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'documents', label: 'Team Documents', icon: FileText },
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md flex-shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-foreground truncate">Mobile App Team</p>
            <p className="text-muted-foreground text-xs">6 members</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className={`
                w-full justify-start gap-3 rounded-xl transition-all h-11
                ${isActive 
                  ? 'bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/20 shadow-sm text-foreground' 
                  : 'hover:bg-primary/10 text-muted-foreground hover:text-foreground'}
              `}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <span>
                {item.label}
              </span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto text-primary" />}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
