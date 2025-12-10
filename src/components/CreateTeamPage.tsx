import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CreateTeamPageProps {
  onNavigate: (page: string) => void;
  onSaveDraft: (data: {
    teamName: string;
    description: string;
    teamMission: string;
    standupTime: string;
    timezone: string;
    isPrivate: boolean;
  }) => void;
}

export function CreateTeamPage({ onNavigate, onSaveDraft }: CreateTeamPageProps) {
  const [formData, setFormData] = useState({
    teamName: '',
    description: '',
    teamMission: '',
    standupTime: '',
    timezone: '',
    slackChannel: '',
    email: '',
    isPrivate: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    onSaveDraft({
      teamName: formData.teamName,
      description: formData.description,
      teamMission: formData.teamMission,
      standupTime: formData.standupTime,
      timezone: formData.timezone,
      isPrivate: formData.isPrivate,
    });

    onNavigate('team-setup');
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-3xl mx-auto p-8">
        <Button
          variant="ghost"
          className="mb-8 gap-2 rounded-xl text-slate-700 hover:text-slate-900"
          onClick={() => onNavigate('onboarding-choice')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg">
              1
            </div>
            <div className="flex-1 h-2 bg-primary rounded shadow-sm"></div>
            <div className="w-10 h-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
              2
            </div>
          </div>
          <h1 className="mb-3">Create Your Team</h1>
          <p className="text-muted-foreground text-lg">
            Set up your team's product workspace
          </p>
        </div>

        <Card className="p-8 rounded-3xl border-border shadow-xl bg-card/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team/Product Name</Label>
              <Input
                id="teamName"
                type="text"
                placeholder="e.g., Mobile App Team, API Platform"
                value={formData.teamName}
                onChange={(e) => handleChange('teamName', e.target.value)}
                className="rounded-xl h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your product or project. This will appear in the About section."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="rounded-xl min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamMission">Team Mission</Label>
              <Textarea
                id="teamMission"
                placeholder="What is your team's mission? Describe your team's goals, values, and what you aim to achieve."
                value={formData.teamMission}
                onChange={(e) => handleChange('teamMission', e.target.value)}
                className="rounded-xl min-h-[120px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="standupTime">Standup Time</Label>
                <Input
                  id="standupTime"
                  type="time"
                  value={formData.standupTime}
                  onChange={(e) => handleChange('standupTime', e.target.value)}
                  className="rounded-xl h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select 
                  value={formData.timezone} 
                  onValueChange={(value) => handleChange('timezone', value)}
                  required
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific (PST)</SelectItem>
                    <SelectItem value="est">Eastern (EST)</SelectItem>
                    <SelectItem value="gmt">Greenwich (GMT)</SelectItem>
                    <SelectItem value="cet">Central European (CET)</SelectItem>
                    <SelectItem value="jst">Japan (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Contact Points</Label>
              
              <div className="space-y-2">
                <Label htmlFor="slackChannel">Slack Channel (Optional)</Label>
                <Input
                  id="slackChannel"
                  type="text"
                  placeholder="#team-mobile-app"
                  value={formData.slackChannel}
                  onChange={(e) => handleChange('slackChannel', e.target.value)}
                  className="rounded-xl h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Team Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="team@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="rounded-xl h-12"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-secondary/50 rounded-xl border border-border/50">
              <div className="space-y-1">
                <p>Private Team</p>
                <p className="text-muted-foreground">
                  Only invited members can access this workspace
                </p>
              </div>
              <Switch 
                checked={formData.isPrivate}
                onCheckedChange={(checked) => handleChange('isPrivate', checked)}
              />
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl h-12"
                onClick={() => onNavigate('onboarding-choice')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/25 h-12"
              >
                Continue to Team Setup
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
