import React from 'react';
import { Home, Users, FileText, MessageSquare, ChevronRight, Smartphone, UserPlus, Plus, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  teamName?: string;
  memberCount?: number;
  hasTeams?: boolean; // Whether user has any teams
  teams?: Array<{ id: string; name: string; memberCount?: number }>; // All teams user is part of
  currentTeamId?: string; // Currently selected team ID
  onTeamChange?: (teamId: string) => void; // Callback when team is changed
}

const allMenuItems = [
  { id: 'about', label: 'About', icon: Home },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'documents', label: 'Team Documents', icon: FileText },
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
  { id: 'create-team', label: 'Create Team', icon: Plus },
  { id: 'join-team', label: 'Join Team', icon: UserPlus },
];

const noTeamMenuItems = [
  { id: 'create-team', label: 'Create Team', icon: Plus },
  { id: 'join-team', label: 'Join Team', icon: UserPlus },
];

export function Sidebar({ 
  activeSection, 
  onSectionChange, 
  teamName, 
  memberCount, 
  hasTeams = true,
  teams = [],
  currentTeamId,
  onTeamChange
}: SidebarProps) {
  const menuItems = hasTeams ? allMenuItems : noTeamMenuItems;

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      {hasTeams ? (
        <div className="p-6 border-b border-border">
          {teams.length > 1 ? (
            // Show dropdown if user has multiple teams
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-between h-auto p-3 hover:bg-accent rounded-xl transition-colors text-left"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md flex-shrink-0">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-sm text-foreground truncate font-medium">{teamName || 'No Team'}</p>
                      <p className="text-muted-foreground text-xs">{memberCount || 0} {memberCount === 1 ? 'member' : 'members'}</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                side="bottom"
                sideOffset={8}
                className="w-64 min-w-[16rem]"
              >
                {teams.map((team) => (
                  <DropdownMenuItem
                    key={team.id}
                    onClick={() => {
                      onTeamChange?.(team.id);
                    }}
                    className={`cursor-pointer ${currentTeamId === team.id ? 'bg-accent' : ''}`}
                    onSelect={(e) => {
                      e.preventDefault();
                      onTeamChange?.(team.id);
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <Smartphone className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{team.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {team.memberCount || 0} {team.memberCount === 1 ? 'member' : 'members'}
                        </p>
                      </div>
                      {currentTeamId === team.id && (
                        <ChevronRight className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Show static display if user has only one team
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md flex-shrink-0">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate">{teamName || 'No Team'}</p>
                <p className="text-muted-foreground text-xs">{memberCount || 0} {memberCount === 1 ? 'member' : 'members'}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-foreground truncate">Welcome</p>
              <p className="text-muted-foreground text-xs">Get started by joining a team</p>
            </div>
          </div>
        </div>
      )}

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
