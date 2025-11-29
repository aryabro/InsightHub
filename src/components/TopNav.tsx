import React, { useState } from 'react';
import { Bell, Brain, FileText, Clock, X, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface TopNavProps {
  onNavigateToProfile?: () => void;
  onLogout?: () => void;
  onNavigateToHome?: () => void;
}

export function TopNav({ onNavigateToProfile, onLogout, onNavigateToHome }: TopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'upload',
      user: 'Sarah Chen',
      userInitials: 'SC',
      document: 'Q4 Product Roadmap.pdf',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'upload',
      user: 'Mike Johnson',
      userInitials: 'MJ',
      document: 'API Documentation v2.1.docx',
      timestamp: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'upload',
      user: 'Emily Watson',
      userInitials: 'EW',
      document: 'Design System Guidelines.pdf',
      timestamp: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'upload',
      user: 'Alex Kim',
      userInitials: 'AK',
      document: 'Sprint Planning Notes.md',
      timestamp: '2 days ago',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <button 
          onClick={onNavigateToHome}
          className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            InsightHub
          </span>
        </button>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl hover:bg-primary/10 text-foreground/70 hover:text-foreground relative"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="w-7 h-7" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-white rounded-full flex items-center justify-center" style={{ fontSize: '10px' }}>
                {unreadCount}
              </span>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="w-9 h-9 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                    JD
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl">
              <DropdownMenuItem 
                onClick={onNavigateToProfile}
                className="rounded-xl cursor-pointer gap-2 h-10"
              >
                <User className="w-4 h-4 text-primary" />
                <span>Show Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onLogout}
                className="rounded-xl cursor-pointer gap-2 h-10 text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
        <SheetContent className="w-full sm:max-w-md custom-scrollbar">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between pr-8">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="rounded-lg bg-primary/10 text-primary">
                  {unreadCount} new
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-1">
            {notifications.map((notification) => (
              <div key={notification.id}>
                <div 
                  className={`p-4 rounded-2xl cursor-pointer transition-colors ${
                    notification.read 
                      ? 'hover:bg-slate-50' 
                      : 'bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10'
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                        {notification.userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium text-foreground">{notification.user}</span>
                            {' uploaded '}
                            <span className="font-medium text-primary">{notification.document}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 ml-10">
                        <Clock className="w-3 h-3" />
                        <span>{notification.timestamp}</span>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                </div>
                {notification.id !== notifications[notifications.length - 1].id && (
                  <Separator className="my-1" />
                )}
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="mb-2 text-slate-900">No notifications</h4>
              <p className="text-slate-500 text-sm">
                You're all caught up!
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
