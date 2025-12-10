import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ArrowLeft, ArrowRight, Mail, X, CheckCircle, Send } from 'lucide-react';
import { addTeamMembers } from '../api/teams';

interface TeamSetupPageProps {
  onNavigate: (page: string) => void;
  teamDraft: any | null;
  onTeamCreated: (team: any) => void;
}

interface Invite {
  email: string;
  role: string;
  note: string;
}

import { createTeam } from '../api/teams';

export function TeamSetupPage({ onNavigate, teamDraft, onTeamCreated }: TeamSetupPageProps) {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'developer',
    note: ''
  });
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddInvite = () => {
    if (inviteForm.email) {
      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inviteForm.email)) {
        setEmailError('Please enter a valid email address');
        return;
      }
      setInvites([...invites, { ...inviteForm }]);
      setInviteForm({ email: '', role: 'developer', note: '' });
      setEmailError('');
    }
  };

  const handleRemoveInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const handleFinish = async () => {
    // Ensure we have team data from previous step
    if (!teamDraft) {
      onNavigate('create-team');
      return;
    }

    setError('');

    try {
      setIsSubmitting(true);

      const payload = {
        name: teamDraft.teamName,
        description: teamDraft.description,
        mission: teamDraft.teamMission,
        standupTime: teamDraft.standupTime,
        timezone: teamDraft.timezone,
        isPrivate: teamDraft.isPrivate,
      };

      const data = await createTeam(payload);
      const teamId = data?.team?.id;
      let memberCount = 1;

      // Add members: only existing users in DB will be attached
      if (teamId && invites.length > 0) {
        const emails = invites.map((i) => i.email);
        const membersResult = await addTeamMembers(teamId, emails);
        if (membersResult?.added?.length) {
          memberCount += membersResult.added.length;
        }
      }

      // Note: Documents uploaded during team setup are just placeholders
      // Users should upload actual documents through the DocumentUploadModal after team creation
      // Skipping document upload here since we need actual File objects, not just names

      if (data?.team) {
        onTeamCreated({
          ...data.team,
          memberCount
        });
      }

      onNavigate('app');
    } catch (err: any) {
      setError(err.message || 'Unable to create team. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-6xl mx-auto p-8">
        <Button
          variant="ghost"
          className="mb-8 gap-2 rounded-xl text-slate-700 hover:text-slate-900"
          onClick={() => onNavigate('create-team')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-success text-white flex items-center justify-center shadow-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 h-2 bg-primary rounded shadow-sm"></div>
            <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg">
              2
            </div>
          </div>
          <h1 className="mb-3">Team Setup</h1>
          <p className="text-muted-foreground text-lg">
            Invite team members to get started
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          {/* Invite Members Card */}
          <Card className="p-8 rounded-3xl border-border shadow-xl bg-card/50 backdrop-blur-sm max-w-2xl w-full">
            <h3 className="mb-6">Invite Team Members</h3>
            
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="inviteEmail">Email Address</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="teammate@company.com"
                  value={inviteForm.email}
                  onChange={(e) => {
                    setInviteForm({ ...inviteForm, email: e.target.value });
                    if (emailError) setEmailError('');
                  }}
                  className={`rounded-xl h-12 ${emailError ? 'border-red-500' : ''}`}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inviteRole">Role</Label>
                <Select 
                  value={inviteForm.role} 
                  onValueChange={(value) => setInviteForm({ ...inviteForm, role: value })}
                >
                  <SelectTrigger className="rounded-xl h-12">
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
                  className="rounded-xl"
                  rows={2}
                />
              </div>

              <Button
                onClick={handleAddInvite}
                className="w-full rounded-xl gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 h-12"
                disabled={!inviteForm.email}
              >
                <Send className="w-4 h-4" />
                Send Invite
              </Button>
            </div>

            {invites.length > 0 && (
              <div className="space-y-2">
                <Label>Pending Invites ({invites.length})</Label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {invites.map((invite, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl border border-border/50"
                    >
                      <Mail className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate mb-2">{invite.email}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="rounded-lg">
                            {invite.role}
                          </Badge>
                          {invite.note && (
                            <span className="text-muted-foreground truncate text-sm">
                              {invite.note}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveInvite(index)}
                        className="flex-shrink-0 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {invites.length === 0 && (
              <div className="text-center py-12 text-muted-foreground bg-secondary/30 rounded-xl border border-border/50">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No invites yet</p>
                <p className="text-sm">Add team members above</p>
              </div>
            )}
          </Card>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-xl h-12"
            onClick={handleFinish}
          >
            Skip for Now
          </Button>
          <Button
            className="flex-1 rounded-xl bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/25 h-12 disabled:opacity-60"
            onClick={handleFinish}
            disabled={isSubmitting}
          >
            Go to Team Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
