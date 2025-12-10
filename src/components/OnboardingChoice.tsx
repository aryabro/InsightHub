import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Plus, Users, ArrowRight } from 'lucide-react';

interface OnboardingChoiceProps {
  onNavigate: (page: string) => void;
}

export function OnboardingChoice({ onNavigate }: OnboardingChoiceProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-8 py-16">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="mb-4">Let's get you set up</h1>
          <p className="text-muted-foreground text-lg">
            Choose how you'd like to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {/* Create Team Card */}
          <Card className="p-10 rounded-3xl border-border shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all cursor-pointer group bg-card/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-lg">
                <Plus className="w-10 h-10 text-white" />
              </div>

              <h2 className="mb-4">Create a Team</h2>
              
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Start fresh with a new product workspace. Perfect for managers starting a new project or product space.
              </p>

              <ul className="text-left space-y-3 mb-10">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Set up your team's product page</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Invite team members</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Upload initial documents</span>
                </li>
              </ul>

              <Button
                className="w-full rounded-xl gap-2 shadow-lg h-12 border-slate-200 hover:bg-primary/10"
                variant="outline"
                size="lg"
                onClick={() => onNavigate('create-team')}
              >
                Create Team
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Join Team Card */}
          <Card className="p-10 rounded-3xl border-border shadow-xl hover:shadow-2xl hover:border-accent/30 transition-all cursor-pointer group bg-card/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>

              <h2 className="mb-4">Join a Team</h2>
              
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Join an existing team workspace. Use an invite code or search for your team in the directory.
              </p>

              <ul className="text-left space-y-3 mb-10">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Enter your invite code</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Get instant access to docs & chat</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Connect with your team immediately</span>
                </li>
              </ul>

              <Button
                className="w-full rounded-xl gap-2 shadow-lg h-12 border-slate-200 hover:bg-primary/10"
                variant="outline"
                size="lg"
                onClick={() => onNavigate('join-team')}
              >
                Join Team
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Skip Button - Bottom Left */}
        <div className="pl-4 md:pl-0">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-transparent gap-2 cursor-pointer"
            onClick={() => onNavigate('app')}
          >
            Skip for now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
