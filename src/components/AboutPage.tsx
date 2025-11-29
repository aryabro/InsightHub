import React, { useState } from 'react';
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
  Send,
  BookOpen
} from 'lucide-react';

interface AboutPageProps {
  onNavigateToMembers?: () => void;
}

export function AboutPage({ onNavigateToMembers }: AboutPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [teamInfo, setTeamInfo] = useState({
    name: 'Mobile App Team',
    description: 'Building iOS and Android applications for customer-facing products. Our mission is to deliver exceptional mobile experiences that delight users and drive engagement across all platforms.',
    contactPoints: {
      slack: '#mobile-team',
      email: 'mobile-team@company.com'
    },
    standupTime: '10:00 AM',
    timezone: 'PST',
    memberCount: 6,
    created: 'January 2024',
    visibility: 'Private'
  });

  const [editForm, setEditForm] = useState(teamInfo);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'developer',
    note: ''
  });
  const [inviteEmailError, setInviteEmailError] = useState('');

  const handleSave = () => {
    setTeamInfo(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(teamInfo);
    setIsEditing(false);
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 rounded-3xl border-border shadow-xl bg-card">
              {!isEditing ? (
                <>
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Smartphone className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="mb-3">{teamInfo.name}</h2>
                      <p className="text-slate-600 leading-relaxed text-justify">
                        {teamInfo.description}
                      </p>
                    </div>
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
                            <p>{teamInfo.contactPoints.slack}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center shadow-sm">
                            <Mail className="w-6 h-6 text-accent" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-slate-500 text-sm mb-0.5">Team Email</p>
                            <p className="truncate">{teamInfo.contactPoints.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 flex items-center justify-center shadow-sm">
                            <Calendar className="w-6 h-6 text-warning" />
                          </div>
                          <div>
                            <p className="text-slate-500 text-sm mb-0.5">Created</p>
                            <p>{teamInfo.created}</p>
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
                            <p>{teamInfo.memberCount} team members</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-sm">
                            <Clock className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-slate-500 text-sm mb-0.5">Standup Time</p>
                            <p>{teamInfo.standupTime} {teamInfo.timezone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 flex items-center justify-center shadow-sm">
                            <Shield className="w-6 h-6 text-destructive" />
                          </div>
                          <div>
                            <p className="text-slate-500 text-sm mb-0.5">Visibility</p>
                            <Badge variant="secondary" className="rounded-lg mt-1 bg-slate-100">
                              {teamInfo.visibility}
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
                        value={editForm.contactPoints.slack}
                        onChange={(e) => setEditForm({ 
                          ...editForm, 
                          contactPoints: { ...editForm.contactPoints, slack: e.target.value }
                        })}
                        className="rounded-xl h-11 border-slate-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Team Email</Label>
                      <Input
                        value={editForm.contactPoints.email}
                        onChange={(e) => setEditForm({ 
                          ...editForm, 
                          contactPoints: { ...editForm.contactPoints, email: e.target.value }
                        })}
                        className="rounded-xl h-11 border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Standup Time</Label>
                      <Input
                        type="time"
                        value={editForm.standupTime.split(' ')[0]}
                        onChange={(e) => setEditForm({ ...editForm, standupTime: e.target.value + ' ' + editForm.timezone })}
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
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-8 rounded-3xl border-slate-200 shadow-lg bg-gradient-to-br from-primary/5 via-indigo-50/30 to-teal-50/30">
              <h3 className="mb-4">Team Mission</h3>
              <p className="text-slate-600 leading-relaxed text-justify">
                Our team is dedicated to creating world-class mobile experiences. We focus on performance, 
                user experience, and delivering features that matter to our customers. We work collaboratively 
                across time zones and maintain high standards for code quality and design.
              </p>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 rounded-3xl border-border shadow-lg bg-card">
              <h3 className="mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start rounded-xl gap-3 h-12 hover:bg-primary/10 border-border"
                  onClick={onNavigateToMembers}
                >
                  <Users className="w-5 h-5 text-primary" />
                  <span>View Team Members</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start rounded-xl gap-3 h-12 hover:bg-primary/10 border-border"
                  onClick={() => setShowInviteModal(true)}
                >
                  <Mail className="w-5 h-5 text-accent" />
                  <span>Invite New Member</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start rounded-xl gap-3 h-12 hover:bg-primary/10 border-border"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-5 h-5 text-success" />
                  <span>Edit Team Details</span>
                </Button>
              </div>
            </Card>

            <Card className="p-6 rounded-3xl border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h4 className="mb-2">Team Knowledge Base</h4>
                <p className="text-slate-600 text-sm mb-4">
                  {teamInfo.memberCount} members collaborating on shared knowledge
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <div className="flex -space-x-2">
                    {['SC', 'MJ', 'EW', 'AK'].map((initials, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 border-2 border-white flex items-center justify-center shadow-sm">
                        <span className="text-xs text-slate-700">{initials}</span>
                      </div>
                    ))}
                  </div>
                  <span>+{teamInfo.memberCount - 4} more</span>
                </div>
              </div>
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
