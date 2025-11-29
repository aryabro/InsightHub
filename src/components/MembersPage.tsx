import React, { useState, useMemo } from 'react';
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
  MapPin, 
  Calendar,
  UserPlus,
  UserMinus,
  Send
} from 'lucide-react';

export function MembersPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamMembers, setTeamMembers] = useState([
    { 
      name: 'Sarah Chen', 
      role: 'Manager', 
      timezone: 'PST', 
      status: 'online',
      email: 'sarah@insighthub.com',
      location: 'San Francisco, CA',
      joined: 'Jan 2024',
      avatar: 'SC',
      color: 'from-primary to-accent'
    },
    { 
      name: 'Mike Johnson', 
      role: 'Developer', 
      timezone: 'EST', 
      status: 'online',
      email: 'mike@insighthub.com',
      location: 'New York, NY',
      joined: 'Feb 2024',
      avatar: 'MJ',
      color: 'from-accent to-accent/70'
    },
    { 
      name: 'Emma Wilson', 
      role: 'Developer', 
      timezone: 'GMT', 
      status: 'away',
      email: 'emma@insighthub.com',
      location: 'London, UK',
      joined: 'Dec 2023',
      avatar: 'EW',
      color: 'from-success to-success/70'
    },
    { 
      name: 'Alex Kim', 
      role: 'Developer', 
      timezone: 'JST', 
      status: 'offline',
      email: 'alex@insighthub.com',
      location: 'Tokyo, Japan',
      joined: 'Mar 2024',
      avatar: 'AK',
      color: 'from-warning to-warning/70'
    },
    { 
      name: 'Jordan Taylor', 
      role: 'Developer', 
      timezone: 'CET', 
      status: 'online',
      email: 'jordan@insighthub.com',
      location: 'Berlin, Germany',
      joined: 'Jan 2024',
      avatar: 'JT',
      color: 'from-purple-500 to-purple-400'
    },
    { 
      name: 'Chris Martinez', 
      role: 'Developer', 
      timezone: 'PST', 
      status: 'online',
      email: 'chris@insighthub.com',
      location: 'Seattle, WA',
      joined: 'Nov 2023',
      avatar: 'CM',
      color: 'from-indigo-500 to-indigo-400'
    },
  ]);

  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'developer',
    note: ''
  });
  const [inviteEmailError, setInviteEmailError] = useState('');

  const handleSendInvite = () => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteForm.email)) {
      setInviteEmailError('Please enter a valid email address');
      return;
    }
    // Handle invite logic here
    setShowInviteModal(false);
    setInviteForm({ email: '', role: 'developer', note: '' });
    setInviteEmailError('');
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  // Filter team members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) {
      return teamMembers;
    }
    
    const query = searchQuery.toLowerCase();
    return teamMembers.filter((member) => 
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.location.toLowerCase().includes(query)
    );
  }, [teamMembers, searchQuery]);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <Card key={index} className="p-6 rounded-3xl border-border shadow-lg hover:shadow-xl hover:border-primary/20 transition-all bg-card">
              <div className="flex flex-col items-center mb-5">
                <div className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white shadow-lg`}>
                  <span className="text-2xl">{member.avatar}</span>
                </div>
              </div>

              <h3 className="mb-2 text-center">{member.name}</h3>
              
              <div className="flex items-center justify-center gap-2 mb-5">
                <Badge variant="secondary" className="rounded-lg bg-slate-100">
                  {member.role}
                </Badge>
                <Badge variant="secondary" className="rounded-lg bg-slate-100">
                  {member.timezone}
                </Badge>
              </div>

              <div className="space-y-3 text-slate-600 text-sm mb-5">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-accent" />
                  <span className="truncate">{member.location}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0 text-success" />
                  <span>Joined {member.joined}</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
                onClick={() => handleRemoveMember(index)}
              >
                <UserMinus className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </Card>
          ))}
        </div>
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
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendInvite}
                disabled={!inviteForm.email}
                className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Invite
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
