import React, { useEffect, useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { OnboardingChoice } from './components/OnboardingChoice';
import { CreateTeamPage } from './components/CreateTeamPage';
import { TeamSetupPage } from './components/TeamSetupPage';
import { JoinTeamPage } from './components/JoinTeamPage';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { AboutPage } from './components/AboutPage';
import { MembersPage } from './components/MembersPage';
import { DocumentsSection } from './components/DocumentsSection';
import { DocumentDetailPage } from './components/DocumentDetailPage';
import { ChatSection } from './components/ChatSection';
import { ProfilePage } from './components/ProfilePage';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { Toaster } from './components/ui/sonner';
import { clearAuth, getStoredAuth, fetchCurrentUser } from './api/auth';
import { fetchMyTeams } from './api/teams';
import { fetchRecentDocuments } from './api/documents';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [activeSection, setActiveSection] = useState('about');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [teamDraft, setTeamDraft] = useState<any | null>(null);
  const [currentTeam, setCurrentTeam] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [myTeams, setMyTeams] = useState<any[]>([]);
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // On mount, restore auth from localStorage
  useEffect(() => {
    const { token, user } = getStoredAuth();
    if (token) {
      setIsAuthenticated(true);
      // Set user immediately from localStorage so it's available right away
      if (user) {
        setCurrentUser(user);
      }
      setCurrentPage((prev) => (prev === 'landing' ? 'app' : prev));
    }
  }, []);

  // Load user, teams, and recent docs when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const load = async () => {
      try {
        const [userRes, teamsRes, docsRes] = await Promise.all([
          fetchCurrentUser(),
          fetchMyTeams(),
          fetchRecentDocuments(3)
        ]);

        setCurrentUser(userRes);
        const teams = teamsRes?.teams || [];
        setMyTeams(teams);
        setRecentDocs(docsRes?.documents || []);

        if (!currentTeam && teams.length) {
          setCurrentTeam(teams[0]);
        } else if (!teams.length && currentPage === 'app') {
          // If user has no teams and is on app page, show profile
          setActiveSection('profile');
        }
      } catch (err) {
        console.error('Failed to load initial app data', err);
      }
    };

    load();
  }, [isAuthenticated, currentTeam]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // Reset to about when entering the app
    if (page === 'app') {
      setActiveSection('about');
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('app');
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
    setCurrentPage('onboarding-choice');
  };

  const handleSectionChange = (section: string) => {
    // Check if user has teams
    const userHasTeams = myTeams.length > 0;
    
    // If user has no teams and tries to access team sections, redirect to join-team
    if (!userHasTeams && ['about', 'members', 'documents', 'chat'].includes(section)) {
      setActiveSection('join-team');
      setCurrentPage('app');
      return;
    }
    
    // Handle special navigation cases
    if (section === 'profile') {
      setCurrentPage('profile');
      setActiveSection('profile');
    } else if (section === 'create-team') {
      // Navigate to create team page
      setCurrentPage('create-team');
    } else if (section === 'join-team') {
      // Keep on app page but show join team in the main content
      setCurrentPage('app');
      setActiveSection('join-team');
    } else if (currentPage !== 'app' && currentPage !== 'document-detail') {
      setCurrentPage('app');
      setActiveSection(section);
    } else {
      setActiveSection(section);
    }
  };

  const handleTeamJoined = async (team: any) => {
    // Refresh teams list
    try {
      const teamsRes = await fetchMyTeams();
      setMyTeams(teamsRes?.teams || []);
      // Set the newly joined team as current team
      setCurrentTeam(team);
      // Switch to about section to show team dashboard
      setActiveSection('about');
    } catch (err) {
      console.error('Failed to refresh teams after joining', err);
    }
  };

  const handleTeamChange = (teamId: string) => {
    const team = myTeams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam(team);
      // Refresh the current section to show new team's data
      // Keep the same active section but update the team context
    }
  };

  const handleLogout = () => {
    clearAuth();
    setIsAuthenticated(false);
    setCurrentPage('landing');
    setActiveSection('about');
  };

  const handleNavigateToHome = () => {
    setCurrentPage('app');
    // If user has no teams, show profile; otherwise show about
    if (myTeams.length === 0) {
      setActiveSection('profile');
    } else {
      setActiveSection('about');
    }
  };

  const hasTeams = myTeams.length > 0;

  const renderSection = () => {
    // If user has no teams, show profile page (unless on join-team or create-team)
    if (!hasTeams && activeSection !== 'join-team' && activeSection !== 'create-team') {
      return (
        <ProfilePage 
          user={currentUser}
          teams={myTeams}
          recentDocuments={recentDocs}
        />
      );
    }

    switch (activeSection) {
      case 'about':
        return (
          <AboutPage 
            teamId={currentTeam?.id}
            onNavigateToMembers={() => setActiveSection('members')} 
          />
        );
      case 'members':
        return <MembersPage teamId={currentTeam?.id} />;
      case 'documents':
        return (
          <DocumentsSection 
            teamId={currentTeam?.id} 
            onDocumentClick={(docId) => {
              setSelectedDocumentId(docId);
              setCurrentPage('document-detail');
            }} 
          />
        );
      case 'chat':
        return <ChatSection teamId={currentTeam?.id} />;
      case 'join-team':
        return (
          <JoinTeamPage 
            inline={true}
            onNavigate={(page) => {
              if (page === 'app') {
                setCurrentPage('app');
                setActiveSection(hasTeams ? 'about' : 'join-team');
              } else {
                setCurrentPage(page);
              }
            }}
            onTeamJoined={handleTeamJoined}
          />
        );
      case 'profile':
        return (
          <ProfilePage 
            user={currentUser}
            teams={myTeams}
            recentDocuments={recentDocs}
          />
        );
      default:
        if (hasTeams) {
          return <AboutPage onNavigateToMembers={() => setActiveSection('members')} />;
        } else {
          return (
            <ProfilePage 
              user={currentUser}
              teams={myTeams}
              recentDocuments={recentDocs}
            />
          );
        }
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      
      case 'login':
        return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
      
      case 'signup':
        return <SignupPage onNavigate={handleNavigate} onSignup={handleSignup} />;
      
      case 'onboarding-choice':
        return <OnboardingChoice onNavigate={handleNavigate} />;
      
      case 'create-team':
        return (
          <CreateTeamPage 
            onNavigate={handleNavigate} 
            onSaveDraft={(data) => setTeamDraft(data)} 
          />
        );
      
      case 'team-setup':
        return (
          <TeamSetupPage 
            onNavigate={handleNavigate} 
            teamDraft={teamDraft}
            onTeamCreated={async (team) => {
              setCurrentTeam(team);
              // Refresh teams list to include the new team
              try {
                const teamsRes = await fetchMyTeams();
                setMyTeams(teamsRes?.teams || []);
              } catch (err) {
                console.error('Failed to refresh teams after creation', err);
              }
            }}
          />
        );
      
      case 'join-team':
        return (
          <div className="h-screen flex flex-col bg-background">
            <TopNav 
              onNavigateToProfile={() => setCurrentPage('profile')}
              onLogout={handleLogout}
              onNavigateToHome={handleNavigateToHome}
              user={currentUser}
              currentTeamId={currentTeam?.id}
            />
            
            <div className="flex flex-1 overflow-hidden">
              <Sidebar 
                activeSection="join-team" 
                onSectionChange={handleSectionChange}
                teamName={currentTeam?.name}
                memberCount={currentTeam?.memberCount}
                hasTeams={myTeams.length > 0}
                teams={myTeams}
                currentTeamId={currentTeam?.id}
                onTeamChange={handleTeamChange}
              />
              
              <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1200px] mx-auto p-8">
                  <JoinTeamPage 
                    onNavigate={(page) => {
                      if (page === 'app') {
                        setCurrentPage('app');
                        setActiveSection('about');
                      } else {
                        setCurrentPage(page);
                      }
                    }}
                    onTeamJoined={handleTeamJoined}
                  />
                </div>
              </main>
            </div>

            <Toaster />
          </div>
        );
      
      case 'app':
        return (
          <div className="h-screen flex flex-col bg-background">
            <TopNav 
              onNavigateToProfile={() => setCurrentPage('profile')}
              onLogout={handleLogout}
              onNavigateToHome={handleLogout}
              user={currentUser}
              currentTeamId={currentTeam?.id}
            />
            
            <div className="flex flex-1 overflow-hidden">
              <Sidebar 
                activeSection={activeSection} 
                onSectionChange={handleSectionChange}
                teamName={currentTeam?.name}
                memberCount={currentTeam?.memberCount}
                hasTeams={hasTeams}
                teams={myTeams}
                currentTeamId={currentTeam?.id}
                onTeamChange={handleTeamChange}
              />
              
              <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1200px] mx-auto p-8">
                  {renderSection()}
                </div>
              </main>
            </div>

            <DocumentUploadModal 
              open={showUploadModal} 
              onOpenChange={setShowUploadModal}
              teamId={currentTeam?.id}
            />
            <Toaster />
          </div>
        );
      
      case 'document-detail':
        return (
          <div className="h-screen flex flex-col bg-background">
            <TopNav 
              onNavigateToProfile={() => setCurrentPage('profile')}
              onLogout={handleLogout}
              onNavigateToHome={handleNavigateToHome}
              user={currentUser}
              currentTeamId={currentTeam?.id}
            />
            
            <div className="flex flex-1 overflow-hidden">
              <Sidebar 
                activeSection="documents" 
                onSectionChange={(section) => {
                  setActiveSection(section);
                  setCurrentPage('app');
                }}
                teamName={currentTeam?.name}
                memberCount={currentTeam?.memberCount}
                hasTeams={hasTeams}
                teams={myTeams}
                currentTeamId={currentTeam?.id}
                onTeamChange={handleTeamChange}
              />
              
              <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1200px] mx-auto p-8">
                  <DocumentDetailPage 
                    documentId={selectedDocumentId || undefined}
                    onNavigate={(page) => {
                      if (page === 'documents') {
                        setActiveSection('documents');
                        setCurrentPage('app');
                        setSelectedDocumentId(null);
                      }
                    }} 
                  />
                </div>
              </main>
            </div>

            <DocumentUploadModal 
              open={showUploadModal} 
              onOpenChange={setShowUploadModal}
              teamId={currentTeam?.id}
            />
            <Toaster />
          </div>
        );
      
      case 'profile':
        return (
          <div className="h-screen flex flex-col bg-background">
            <TopNav 
              onNavigateToProfile={() => setCurrentPage('profile')}
              onLogout={handleLogout}
              onNavigateToHome={handleNavigateToHome}
              user={currentUser}
              currentTeamId={currentTeam?.id}
            />
            
            <div className="flex flex-1 overflow-hidden">
              <Sidebar 
                activeSection={activeSection} 
                onSectionChange={handleSectionChange}
                teamName={currentTeam?.name}
                memberCount={currentTeam?.memberCount}
                hasTeams={hasTeams}
                teams={myTeams}
                currentTeamId={currentTeam?.id}
                onTeamChange={handleTeamChange}
              />
              
              <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1200px] mx-auto p-8">
                  <ProfilePage 
                    user={currentUser}
                    teams={myTeams}
                    recentDocuments={recentDocs}
                  />
                </div>
              </main>
            </div>

            <Toaster />
          </div>
        );
      
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return renderPage();
}
