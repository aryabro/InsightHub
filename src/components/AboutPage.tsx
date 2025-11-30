import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Edit, 
  Slack,
  Mail,
  Users,
  Calendar,
  Shield,
  Smartphone,
  Clock,
  Save,
  X,
  Send
} from 'lucide-react';
import { fetchTeam, updateTeam, addTeamMembers } from '../api/teams';
import { toast } from 'sonner@2.0.3';

interface AboutPageProps {
  onNavigateToMembers?: () => void;
  teamId?: string;
}

export function AboutPage({ onNavigateToMembers, teamId }: AboutPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamInfo, setTeamInfo] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    standupTime: '',
    timezone: '',
    slackChannel: '',
    email: '',
    isPrivate: true
  });
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'developer',
    note: ''
  });
  const [inviteEmailError, setInviteEmailError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (teamId) {
      loadTeamData();
    }
  }, [teamId]);

  const loadTeamData = async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      const data = await fetchTeam(teamId);
      const team = data?.team;
      
      if (team) {
        setTeamInfo(team);
        setEditForm({
          name: team.name || '',
          description: team.description || '',
          standupTime: team.standupTime || '',
          timezone: team.timezone || '',
          slackChannel: team.slackChannel || '',
          email: team.email || '',
          isPrivate: team.isPrivate !== undefined ? team.isPrivate : true
        });
      }
    } catch (err: any) {
      toast.error('Failed to load team data', {
        description: err.message || 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (time: string, timezone: string) => {
    if (!time) return '';
    // If time is in HH:MM format, convert to readable format
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm} ${timezone?.toUpperCase() || ''}`;
    }
    return `${time} ${timezone?.toUpperCase() || ''}`;
  };

  const handleSave = async () => {
    if (!teamId) return;
    
    try {
      setIsSaving(true);
      const data = await updateTeam(teamId, {
        name: editForm.name,
        description: editForm.description,
        standupTime: editForm.standupTime,
        timezone: editForm.timezone.toLowerCase(),
        slackChannel: editForm.slackChannel || undefined,
        email: editForm.email || undefined,
        isPrivate: editForm.isPrivate
      });

      if (data?.team) {
        setTeamInfo(data.team);
        toast.success('Team details updated successfully');
        setIsEditing(false);
      }
    } catch (err: any) {
      toast.error('Failed to update team', {
        description: err.message || 'Please try again'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (teamInfo) {
      setEditForm({
        name: teamInfo.name || '',
        description: teamInfo.description || '',
        standupTime: teamInfo.standupTime || '',
        timezone: teamInfo.timezone || '',
        slackChannel: teamInfo.slackChannel || '',
        email: teamInfo.email || '',
        isPrivate: teamInfo.isPrivate !== undefined ? teamInfo.isPrivate : true
      });
    }
    setIsEditing(false);
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
        // Reload team data to update member count
        loadTeamData();
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

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (!teamInfo) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600">No team selected</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">About</h1>
            <p className="text-slate-600">
              Team information and details
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Info */}
          <div className="space-y-6">
            <Card className="p-8 rounded-3xl border-border shadow-xl bg-card relative">
              {!isEditing ? (
                <>
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Smartphone className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="mb-3">{teamInfo.name}</h2>
                      <p className="text-slate-600 leading-relaxed text-justify">
                        {teamInfo.description || 'No description provided'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="rounded-xl gap-2 hover:bg-primary/10 absolute top-8 right-8"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Team Details
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="mb-6">Contact Points</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-sm">
                            <Slack className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-slate-500 text-sm mb-0.5">Slack Channel</p>
                            <p>{teamInfo.slackChannel || 'Not set'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center shadow-sm">
                            <Mail className="w-6 h-6 text-accent" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-slate-500 text-sm mb-0.5">Team Email</p>
                            <p className="truncate">{teamInfo.email || 'Not set'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 flex items-center justify-center shadow-sm">
                            <Calendar className="w-6 h-6 text-warning" />
                          </div>
                          <div>
                            <p className="text-slate-500 text-sm mb-0.5">Created</p>
                            <p>{formatDate(teamInfo.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-6">Team Details</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success/10 to-success/5 flex items-center justify-center shadow-sm">
                            <Users className="w-6 h-6 text-success" />
                          </div>
                          <div>
                            <p className="text-slate-500 text-sm mb-0.5">Members</p>
                            <p>{teamInfo.memberCount || 0} team members</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-sm">
                            <Clock className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-slate-500 text-sm mb-0.5">Standup Time</p>
                            <p>{formatTime(teamInfo.standupTime, teamInfo.timezone)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 flex items-center justify-center shadow-sm">
                            <Shield className="w-6 h-6 text-destructive" />
                          </div>
                          <div>
                            <p className="text-slate-500 text-sm mb-0.5">Visibility</p>
                            <Badge variant="secondary" className="rounded-lg mt-1 bg-slate-100">
                              {teamInfo.isPrivate ? 'Private' : 'Public'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <h3 className="mb-6">Edit Team Details</h3>
                  
                  <div className="space-y-2">
                    <Label>Team Name</Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="rounded-xl h-11 border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="rounded-xl min-h-[100px] border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Slack Channel</Label>
                      <Input
                        value={editForm.slackChannel}
                        onChange={(e) => setEditForm({ ...editForm, slackChannel: e.target.value })}
                        placeholder="#team-channel"
                        className="rounded-xl h-11 border-slate-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Team Email</Label>
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="team@company.com"
                        className="rounded-xl h-11 border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Standup Time</Label>
                      <Input
                        type="time"
                        value={editForm.standupTime}
                        onChange={(e) => setEditForm({ ...editForm, standupTime: e.target.value })}
                        className="rounded-xl h-11 border-slate-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select 
                        value={editForm.timezone.toLowerCase()} 
                        onValueChange={(value) => setEditForm({ ...editForm, timezone: value.toUpperCase() })}
                      >
                        <SelectTrigger className="rounded-xl h-11 border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pst">PST</SelectItem>
                          <SelectItem value="est">EST</SelectItem>
                          <SelectItem value="gmt">GMT</SelectItem>
                          <SelectItem value="cet">CET</SelectItem>
                          <SelectItem value="jst">JST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="rounded-xl border-border hover:bg-primary/10"
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20"
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              )}
            </Card>

          </div>
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
