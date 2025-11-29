import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Briefcase,
  Users,
  FileText,
  Edit,
  Save,
  X
} from 'lucide-react';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@insighthub.com',
    phone: '+1 (555) 123-4567',
    role: 'Developer',
    timezone: 'PST'
  });

  const [editForm, setEditForm] = useState(profile);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const teams = [
    { name: 'Mobile App Team', role: 'Developer', memberCount: 6 },
    { name: 'API Platform', role: 'Manager', memberCount: 8 }
  ];

  const recentDocs = [
    { title: 'Authentication Best Practices', date: '2 days ago' },
    { title: 'Mobile Integration Guide', date: '5 days ago' },
    { title: 'Testing Runbook', date: '1 week ago' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">My Profile</h1>
          <p className="text-slate-600">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 rounded-3xl border-slate-200 shadow-lg bg-white">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white mb-6 shadow-xl">
                <span className="text-4xl">{profile.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              {!isEditing ? (
                <>
                  <h2 className="mb-2">{profile.name}</h2>
                  <Badge variant="secondary" className="rounded-lg bg-slate-100">
                    {profile.role}
                  </Badge>
                </>
              ) : (
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="rounded-xl h-11 border-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>

            {!isEditing ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-500 text-sm mb-0.5">Email</p>
                      <p className="truncate">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                    <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-500 text-sm mb-0.5">Phone</p>
                      <p>{profile.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                    <Globe className="w-5 h-5 text-success flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-500 text-sm mb-0.5">Time Zone</p>
                      <p>{profile.timezone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                    <Briefcase className="w-5 h-5 text-warning flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-500 text-sm mb-0.5">Role</p>
                      <p>{profile.role}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full mt-8 rounded-xl gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20" 
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="rounded-xl h-11 border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="rounded-xl h-11 border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Time Zone</Label>
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

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select 
                      value={editForm.role.toLowerCase()} 
                      onValueChange={(value) => setEditForm({ ...editForm, role: value.charAt(0).toUpperCase() + value.slice(1) })}
                    >
                      <SelectTrigger className="rounded-xl h-11 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="product">Product Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 rounded-xl border-slate-200 hover:bg-primary/10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </>
            )}
          </Card>

          <Card className="p-6 rounded-3xl border-slate-200 shadow-lg bg-gradient-to-br from-primary/5 via-indigo-50/30 to-teal-50/30">
            <h3 className="mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                <span className="text-slate-600">Teams</span>
                <span className="text-slate-900">{teams.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                <span className="text-slate-600">Documents</span>
                <span className="text-slate-900">{recentDocs.length}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 rounded-3xl border-slate-200 shadow-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3>My Teams</h3>
              <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-primary/10">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {teams.map((team, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 hover:border-primary/20 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="mb-1">{team.name}</p>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="rounded-lg bg-slate-100">
                            {team.role}
                          </Badge>
                          <span className="text-slate-500 text-sm">
                            {team.memberCount} members
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 rounded-3xl border-slate-200 shadow-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3>Recent Documents</h3>
              <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-primary/10">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentDocs.map((doc, index) => (
                <div
                  key={index}
                  className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 hover:border-primary/20 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="mb-0.5">{doc.title}</p>
                        <span className="text-slate-500 text-sm">
                          Updated {doc.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
