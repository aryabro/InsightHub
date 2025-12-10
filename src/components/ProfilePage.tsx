import React, { useEffect, useState } from 'react';
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
  Edit,
  Save,
  X
} from 'lucide-react';
import { fetchCurrentUser, updateProfile } from '../api/auth';
import { fetchMyTeams } from '../api/teams';
import { toast } from 'sonner@2.0.3';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [teams, setTeams] = useState<any[]>([]);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Member',
    timezone: 'PST'
  });

  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [userData, teamsData] = await Promise.all([
        fetchCurrentUser(),
        fetchMyTeams()
      ]);

      setUser(userData);
      setTeams(teamsData?.teams || []);

      const profileData = {
        name: userData?.fullName || 'User',
        email: userData?.email || '',
        phone: userData?.phone || '',
        role: userData?.role || 'Member',
        timezone: userData?.timezone || 'PST'
      };
      setProfile(profileData);
      setEditForm(profileData);
    } catch (err: any) {
      toast.error('Failed to load profile data', {
        description: err.message || 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updated = await updateProfile({
        fullName: editForm.name,
        phone: editForm.phone,
        role: editForm.role.toLowerCase(),
        timezone: editForm.timezone.toLowerCase()
      });

      setProfile({
        name: updated.fullName || editForm.name,
        email: updated.email || editForm.email,
        phone: updated.phone || editForm.phone,
        role: updated.role || editForm.role,
        timezone: updated.timezone || editForm.timezone
      });
      setUser(updated);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error('Failed to update profile', {
        description: err.message || 'Please try again'
      });
    }
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

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
                  onClick={handleEditClick}
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
                      disabled
                      className="rounded-xl h-11 border-slate-200 bg-slate-50 cursor-not-allowed opacity-70"
                    />
                    <p className="text-xs text-slate-500">Email cannot be changed</p>
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
        </div>

        {/* Right Column - Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 rounded-3xl border-slate-200 shadow-lg bg-white">
            <h3 className="mb-6">My Teams</h3>
            <div className="space-y-4">
              {teams.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No teams yet</p>
                  <p className="text-sm">Join or create a team to get started</p>
                </div>
              ) : (
                teams.map((team) => (
                  <div
                    key={team.id}
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
                              Member
                            </Badge>
                            <span className="text-slate-500 text-sm">
                              {team.memberCount || 0} members
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
