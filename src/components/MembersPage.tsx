import React, { useState, useMemo, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Search, 
  Mail, 
  Calendar,
  UserPlus,
  UserMinus,
  Send
} from 'lucide-react';
import { fetchTeamMembers, addTeamMembers, removeTeamMember } from '../api/teams';
import { getStoredAuth } from '../api/auth';
import { toast } from 'sonner@2.0.3';

interface MembersPageProps {
  teamId?: string;
}

export function MembersPage({ teamId }: MembersPageProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isCreator, setIsCreator] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'developer',
    note: ''
  });
  const [inviteEmailError, setInviteEmailError] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (teamId) {
      loadMembers();
    }
  }, [teamId]);

  const loadMembers = async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      const data = await fetchTeamMembers(teamId);
      const { user } = getStoredAuth();
      
      setTeamMembers(data?.members || []);
      setIsCreator(data?.createdBy === user?.id);
      setCurrentUserId(user?.id || null);
    } catch (err: any) {
      toast.error('Failed to load team members', {
        description: err.message || 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatJoinedDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getColorClass = (index: number) => {
    const colors = [
      'from-primary to-accent',
      'from-accent to-accent/70',
      'from-success to-success/70',
      'from-warning to-warning/70',
      'from-purple-500 to-purple-400',
      'from-indigo-500 to-indigo-400'
    ];
    return colors[index % colors.length];
  };

  const handleSendInvite = async () => {
    if (!teamId) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteForm.email)) {
      setInviteEmailError('Please enter a valid email address');
      return;
    }

    try {
      setIsInviting(true);
      const result = await addTeamMembers(teamId, [inviteForm.email]);
      
      if (result?.added?.length > 0) {
        toast.success('Member invited successfully');
        setShowInviteModal(false);
        setInviteForm({ email: '', role: 'developer', note: '' });
        setInviteEmailError('');
        // Reload members
        loadMembers();
      } else if (result?.notFound?.length > 0) {
        toast.error('User not found', {
          description: 'This email is not registered. Please ask them to sign up first.'
        });
      }
    } catch (err: any) {
      toast.error('Failed to invite member', {
        description: err.message || 'Please try again'
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!teamId) return;
    
    try {
      setRemovingMemberId(memberId);
      await removeTeamMember(teamId, memberId);
      toast.success('Member removed successfully');
      // Reload members
      loadMembers();
    } catch (err: any) {
      toast.error('Failed to remove member', {
        description: err.message || 'Please try again'
      });
    } finally {
      setRemovingMemberId(null);
    }
  };

  // Filter team members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) {
      return teamMembers;
    }
    
    const query = searchQuery.toLowerCase();
    return teamMembers.filter((member) => 
      member.name?.toLowerCase().includes(query) ||
      member.role?.toLowerCase().includes(query) ||
      member.email?.toLowerCase().includes(query) ||
      member.timezone?.toLowerCase().includes(query)
    );
  }, [teamMembers, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Team Members</h1>
            <p className="text-slate-600">
              Manage your team members and their roles
            </p>
          </div>
          <Button 
            className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20"
            onClick={() => setShowInviteModal(true)}
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search team members..." 
              className="pl-10 rounded-xl border-slate-200 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No members found</p>
            <p className="text-sm">Invite team members to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <Card key={member.id} className="p-6 rounded-3xl border-border shadow-lg hover:shadow-xl hover:border-primary/20 transition-all bg-card">
                <div className="flex flex-col items-center mb-5">
                  <div className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${getColorClass(index)} flex items-center justify-center text-white shadow-lg`}>
                    <span className="text-2xl">{getInitials(member.name)}</span>
                  </div>
                </div>

                <h3 className="mb-2 text-center">{member.name}</h3>
                
                <div className="flex items-center justify-center gap-2 mb-5">
                  <Badge variant="secondary" className="rounded-lg bg-slate-100">
                    {member.role || 'Member'}
                  </Badge>
                  {member.timezone && (
                    <Badge variant="secondary" className="rounded-lg bg-slate-100">
                      {member.timezone.toUpperCase()}
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 text-slate-600 text-sm mb-5">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4 flex-shrink-0 text-success" />
                    <span>Joined {formatJoinedDate(member.joined)}</span>
                  </div>
                </div>

                {isCreator && member.id !== currentUserId && (
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={removingMemberId === member.id}
                  >
                    <UserMinus className="w-4 h-4 mr-2" />
                    {removingMemberId === member.id ? 'Removing...' : 'Remove'}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="teammate@company.com"
                value={inviteForm.email}
                onChange={(e) => {
                  setInviteForm({ ...inviteForm, email: e.target.value });
                  if (inviteEmailError) setInviteEmailError('');
                }}
                className={`rounded-xl h-11 border-slate-200 ${inviteEmailError ? 'border-red-500' : ''}`}
              />
              {inviteEmailError && (
                <p className="text-red-500 text-sm mt-1">{inviteEmailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <Select 
                value={inviteForm.role} 
                onValueChange={(value) => setInviteForm({ ...inviteForm, role: value })}
              >
                <SelectTrigger className="rounded-xl h-11 border-slate-200">
                  <SelectValue />
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
              <Label htmlFor="inviteNote">Optional Note</Label>
              <Textarea
                id="inviteNote"
                placeholder="Welcome to the team!"
                value={inviteForm.note}
                onChange={(e) => setInviteForm({ ...inviteForm, note: e.target.value })}
                className="rounded-xl border-slate-200"
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => setShowInviteModal(false)}
                variant="outline"
                className="flex-1 rounded-xl border-border hover:bg-primary/10"
                disabled={isInviting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendInvite}
                disabled={!inviteForm.email || isInviting}
                className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20"
              >
                <Send className="w-4 h-4 mr-2" />
                {isInviting ? 'Inviting...' : 'Send Invite'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
