import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Lock, Users, Search, Loader2 } from 'lucide-react';
import { joinTeam, fetchPublicTeams } from '../api/teams';
import { toast } from 'sonner';

interface JoinTeamPageProps {
  onNavigate: (page: string) => void;
  onTeamJoined?: (team: any) => void;
  inline?: boolean; // If true, render in a more compact inline format
}

export function JoinTeamPage({ onNavigate, onTeamJoined, inline = false }: JoinTeamPageProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [publicTeams, setPublicTeams] = useState<any[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPublicTeams();
  }, []);

  const loadPublicTeams = async () => {
    setIsLoadingTeams(true);
    try {
      const res = await fetchPublicTeams();
      setPublicTeams(res.teams || []);
    } catch (err: any) {
      console.error('Failed to load public teams', err);
      toast.error(err.message || 'Failed to load public teams');
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const handleJoinWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setIsJoining(true);
    try {
      const res = await joinTeam(inviteCode.trim().toUpperCase());
      toast.success(`Successfully joined ${res.team.name}!`);
      if (onTeamJoined) {
        onTeamJoined(res.team);
      }
      onNavigate('app');
    } catch (err: any) {
      toast.error(err.message || 'Failed to join team');
    } finally {
      setIsJoining(false);
    }
  };

  const handleJoinPublicTeam = async (teamId: string) => {
    setIsJoining(true);
    try {
      const res = await joinTeam(undefined, teamId);
      toast.success(`Successfully joined ${res.team.name}!`);
      if (onTeamJoined) {
        onTeamJoined(res.team);
      }
      onNavigate('app');
    } catch (err: any) {
      toast.error(err.message || 'Failed to join team');
    } finally {
      setIsJoining(false);
    }
  };

  const filteredTeams = publicTeams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.description && team.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const content = (
    <>
      {!inline && (
        <>
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
              Use an invite code or browse public teams
            </p>
          </div>
        </>
      )}

      {inline && (
        <div className="mb-6">
          <h1 className="mb-2">Join a Team</h1>
          <p className="text-muted-foreground">
            Use an invite code or browse public teams
          </p>
        </div>
      )}

        <Card className={inline ? "rounded-xl border-border shadow-sm" : "rounded-3xl border-slate-200 shadow-2xl bg-white/90 backdrop-blur-xl"}>
          <div className="p-10">
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="code" className="rounded-xl">
                  <Lock className="w-4 h-4 mr-2" />
                  Join with Code
                </TabsTrigger>
                <TabsTrigger value="public" className="rounded-xl">
                  <Users className="w-4 h-4 mr-2" />
                  Browse Public Teams
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="mt-0">
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
                        disabled={isJoining}
                      />
                      <p className="text-slate-500 text-center text-sm">
                        Usually in format: ABC-XYZ-123
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent/80 shadow-lg shadow-accent/30 h-12"
                      size="lg"
                      disabled={!inviteCode || isJoining}
                    >
                      {isJoining ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        'Join Team'
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="public" className="mt-0">
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search public teams..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl h-12 border-slate-200"
                    />
                  </div>

                  {isLoadingTeams ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    </div>
                  ) : filteredTeams.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600">
                        {searchQuery ? 'No teams found matching your search' : 'No public teams available'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredTeams.map((team) => (
                        <Card key={team.id} className="p-6 border-slate-200 hover:border-accent/50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">{team.name}</h3>
                              {team.description && (
                                <p className="text-slate-600 mb-3 line-clamp-2">{team.description}</p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span>{team.memberCount} {team.memberCount === 1 ? 'member' : 'members'}</span>
                                {team.createdBy && (
                                  <span>Created by {team.createdBy.name}</span>
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={() => handleJoinPublicTeam(team.id)}
                              disabled={isJoining}
                              className="ml-4 rounded-xl bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent/80 shadow-lg shadow-accent/30"
                            >
                              {isJoining ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                'Join'
                              )}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
    </>
  );

  if (inline) {
    return <div className="w-full">{content}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-teal-50/40 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto p-8 relative">
        {content}
      </div>
    </div>
  );
}
