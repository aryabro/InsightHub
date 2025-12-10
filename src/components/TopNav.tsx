import React, { useState, useEffect } from 'react';
import { Bell, Brain, FileText, Clock, User, LogOut, Users, Edit } from 'lucide-react';
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
import { fetchTeamNotifications, Notification } from '../api/notifications';
import { toast } from 'sonner@2.0.3';

interface TopNavProps {
  onNavigateToProfile?: () => void;
  onLogout?: () => void;
  onNavigateToHome?: () => void;
  user?: {
    fullName?: string;
    email?: string;
  } | null;
  currentTeamId?: string | null;
}

export function TopNav({ onNavigateToProfile, onLogout, onNavigateToHome, user, currentTeamId }: TopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate initials from user's full name
  const getInitials = (name?: string): string => {
    if (!name) return 'U'; // Default to 'U' for User
    
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      // Single name - take first 2 letters
      return parts[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple names - take first letter of first and last name
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
  };

  const userInitials = getInitials(user?.fullName);

  // Load notifications when sheet opens and team changes
  useEffect(() => {
    if (showNotifications && currentTeamId) {
      loadNotifications();
    }
  }, [showNotifications, currentTeamId]);

  const loadNotifications = async () => {
    if (!currentTeamId) return;
    
    try {
      setLoading(true);
      const data = await fetchTeamNotifications(currentTeamId);
      setNotifications(data.notifications || []);
    } catch (err: any) {
      console.error('Failed to load notifications', err);
      toast.error('Failed to load notifications', {
        description: err.message || 'Please try again'
      });
    } finally {
      setLoading(false);
    }
  };


  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    return new Date(dateString).toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'document_uploaded':
        return <FileText className="w-4 h-4 text-primary" />;
      case 'member_added':
        return <Users className="w-4 h-4 text-success" />;
      case 'member_removed':
        return <Users className="w-4 h-4 text-destructive" />;
      case 'team_updated':
        return <Edit className="w-4 h-4 text-warning" />;
      default:
        return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'document_uploaded':
        return 'from-primary/10 to-primary/5';
      case 'member_added':
        return 'from-success/10 to-success/5';
      case 'member_removed':
        return 'from-destructive/10 to-destructive/5';
      case 'team_updated':
        return 'from-warning/10 to-warning/5';
      default:
        return 'from-primary/10 to-primary/5';
    }
  };

  const unreadCount = notifications.length; // All notifications are "unread" until deleted

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
                    {userInitials}
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-slate-600">Loading notifications...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className="p-4 rounded-2xl transition-colors bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 group">
                    <div className="flex gap-3">
                      {notification.createdBy ? (
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                            {getInitials(notification.createdBy.name)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center flex-shrink-0">
                          <Bell className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getNotificationColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 ml-10">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(notification.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index !== notifications.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="mb-2 text-slate-900">No notifications</h4>
                <p className="text-slate-500 text-sm">
                  {currentTeamId ? "You're all caught up!" : "Select a team to see notifications"}
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
