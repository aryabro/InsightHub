import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Bell, Lock, User, Palette, CheckCircle2 } from 'lucide-react';

export function SettingsSection() {
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@insighthub.com',
    phone: '+1 (555) 123-4567',
    timezone: 'pst'
  });

  const [savedProfileData, setSavedProfileData] = useState(profileData);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = () => {
    setSavedProfileData(profileData);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleUpdatePassword = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    // Validate current password length
    if (passwordData.currentPassword.length < 8) {
      errors.currentPassword = 'Password must be at least 8 characters long';
    }

    // Validate new password length
    if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    }

    // Check if current and new password are the same
    if (passwordData.currentPassword && passwordData.newPassword && 
        passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    // Check if new password and confirm password match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);

    // If no errors, proceed with update
    if (!errors.currentPassword && !errors.newPassword && !errors.confirmPassword) {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-top-5">
          <Card className="p-4 rounded-2xl border-success/20 bg-white shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-slate-900">Changes Saved</p>
                <p className="text-slate-600 text-sm">Your settings have been updated successfully</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div>
        <h1 className="mb-2">Settings</h1>
        <p className="text-slate-600">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl border border-slate-200 p-1">
          <TabsTrigger value="profile" className="rounded-lg gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg gap-2">
            <Lock className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-lg gap-2">
            <Palette className="w-4 h-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-8 rounded-3xl border-slate-200 shadow-lg bg-white">
            <h3 className="mb-6">Personal Information</h3>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input 
                    placeholder="John" 
                    className="rounded-xl h-11 border-slate-200" 
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input 
                    placeholder="Doe" 
                    className="rounded-xl h-11 border-slate-200" 
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="rounded-xl h-11 border-slate-200"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  className="rounded-xl h-11 border-slate-200"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select 
                  value={profileData.timezone}
                  onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}
                >
                  <SelectTrigger className="rounded-xl h-11 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                    <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                    <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="cet">Central European Time (CET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleSaveProfile}
                  className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-8 rounded-3xl border-slate-200 shadow-lg bg-white">
            <h3 className="mb-6">Email Notifications</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <p>Document Updates</p>
                  <p className="text-sm text-slate-500">Get notified when documents are added or updated</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <p>Mentions</p>
                  <p className="text-sm text-slate-500">Get notified when someone mentions you</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <p>Team Summary</p>
                  <p className="text-sm text-slate-500">Receive weekly summary of team updates</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-8 rounded-3xl border-slate-200 shadow-lg bg-white">
            <h3 className="mb-6">Security Settings</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input 
                  type="password" 
                  className={`rounded-xl h-11 border-slate-200 ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, currentPassword: e.target.value });
                    if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: '' });
                  }}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                )}
                <p className="text-slate-500 text-sm">Minimum 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <Input 
                  type="password" 
                  className={`rounded-xl h-11 border-slate-200 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, newPassword: e.target.value });
                    if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: '' });
                  }}
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                )}
                <p className="text-slate-500 text-sm">Minimum 8 characters, must be different from current password</p>
              </div>

              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input 
                  type="password" 
                  className={`rounded-xl h-11 border-slate-200 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                    if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: '' });
                  }}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleUpdatePassword}
                  className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20"
                >
                  Update Password
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-8 rounded-3xl border-slate-200 shadow-lg bg-white">
            <h3 className="mb-6">Two-Factor Authentication</h3>
            <p className="text-slate-600 mb-6">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50">
              Enable 2FA
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="p-8 rounded-3xl border-slate-200 shadow-lg bg-white">
            <h3 className="mb-6">Appearance & Display</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="rounded-xl h-11 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger className="rounded-xl h-11 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
