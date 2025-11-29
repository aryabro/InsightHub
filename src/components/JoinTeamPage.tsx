import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { ArrowLeft, Lock } from 'lucide-react';

interface JoinTeamPageProps {
  onNavigate: (page: string) => void;
}

export function JoinTeamPage({ onNavigate }: JoinTeamPageProps) {
  const [inviteCode, setInviteCode] = useState('');

  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-teal-50/40 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-2xl mx-auto p-8 relative">
        <Button
          variant="ghost"
          className="mb-8 gap-2 rounded-xl hover:bg-primary/10 text-slate-700 hover:text-slate-900"
          onClick={() => onNavigate('onboarding-choice')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="mb-8 text-center">
          <h1 className="mb-3">Join a Team</h1>
          <p className="text-slate-600 text-lg">
            Enter your invite code to join your team
          </p>
        </div>

        <Card className="rounded-3xl border-slate-200 shadow-2xl bg-white/90 backdrop-blur-xl">
          <div className="p-10">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Lock className="w-10 h-10 text-accent" />
                </div>
                <h3 className="mb-2">Enter Invite Code</h3>
                <p className="text-slate-600">
                  Your team manager should have sent you an invite code
                </p>
              </div>

              <form onSubmit={handleJoinWithCode} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite Code</Label>
                  <Input
                    id="inviteCode"
                    type="text"
                    placeholder="ABC-XYZ-123"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="rounded-xl text-center text-lg tracking-wider h-14 border-slate-200 focus:border-accent focus:ring-accent/20"
                    required
                  />
                  <p className="text-slate-500 text-center text-sm">
                    Usually in format: ABC-XYZ-123
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent/80 shadow-lg shadow-accent/30 h-12"
                  size="lg"
                  disabled={!inviteCode}
                >
                  Join Team
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
