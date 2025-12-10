import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowRight, FileText, MessageSquare, Users, Zap, Shield, Check, Brain, Sparkles } from 'lucide-react';
import { HeroAnimation } from './HeroAnimation';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: FileText,
      title: 'Centralized Product Knowledge',
      description: 'Everything in one place: documents, design specs, API docs, and runbooks. Each team gets their own dedicated page.',
      color: 'from-primary to-primary/60'
    },
    {
      icon: MessageSquare,
      title: 'AI Answers from Your Docs',
      description: 'Chat with an AI trained on your uploaded knowledge base. Get instant answers with citations to source documents.',
      color: 'from-accent to-accent/60'
    },
    {
      icon: Users,
      title: 'Faster Onboarding',
      description: 'New team members get a clean, unified snapshot of your product, team, and resources with no more hunting for info.',
      color: 'from-success to-success/60'
    }
  ];

  const benefits = [
    'Instant knowledge sharing across teams',
    'AI-powered search through all docs',
    'Real-time collaboration features',
    'Secure, private team workspaces'
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-teal-50/30">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl z-50 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              InsightHub
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="rounded-xl hover:bg-primary/10 text-slate-700 hover:text-slate-900"
              onClick={() => onNavigate('login')}
            >
              Log In
            </Button>
            <Button 
              className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/30"
              onClick={() => onNavigate('signup')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full mb-6 shadow-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI-Powered Knowledge Platform</span>
              </div>
              
              <h1 className="mb-4 text-5xl leading-tight">
                Docs, people, and<br />
                answers <span className="text-slate-900">in </span>
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  one place
                </span>
              </h1>
              
              <p className="text-slate-600 mb-8 text-xl leading-relaxed max-w-lg">
                The centralized knowledge hub that keeps your team aligned and your new members up to speed, fast.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 gap-2 shadow-xl shadow-primary/30 text-lg h-14 px-8"
                  onClick={() => onNavigate('signup')}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center shadow-sm">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-slate-600">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Visualization */}
            <div className="relative">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative">
        <div className="text-center mb-12">
          <h2 className="mb-6 text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Everything your team needs</h2>
          <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Stop switching between tools. InsightHub brings your product knowledge, team info, 
            and AI-powered search together in one beautiful interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-10 rounded-3xl border-slate-200 shadow-lg hover:shadow-2xl hover:border-primary/20 transition-all group bg-white/80 backdrop-blur-sm text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg mx-auto`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-4 text-xl">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-justify">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-slate-100 via-indigo-50/50 to-teal-50/50 py-16 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-3 text-xl">Lightning Fast</h3>
              <p className="text-slate-600 leading-relaxed">
                Find answers in seconds, not hours
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="mb-3 text-xl">Private & Secure</h3>
              <p className="text-slate-600 leading-relaxed">
                Your data stays with your team only
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-success" />
              </div>
              <h3 className="mb-3 text-xl">Team-First</h3>
              <p className="text-slate-600 leading-relaxed">
                Built for product teams that ship fast
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Card className="p-12 rounded-3xl border-slate-200 shadow-2xl bg-gradient-to-br from-white via-indigo-50/20 to-teal-50/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <h2 className="mb-6 text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Ready to centralize your team's knowledge?</h2>
            <p className="text-slate-600 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
              Join teams that are shipping faster with InsightHub
            </p>
            <Button 
              size="lg" 
              className="rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 gap-2 shadow-xl shadow-primary/30 text-lg h-14 px-10"
              onClick={() => onNavigate('signup')}
            >
              Start Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl text-white">
                InsightHub
              </span>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-700 text-center text-slate-400">
            <p>© 2025 InsightHub. Your team's product brain.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
