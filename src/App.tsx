import React, { useState } from 'react';
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
import { SettingsSection } from './components/SettingsSection';
import { ProfilePage } from './components/ProfilePage';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [activeSection, setActiveSection] = useState('about');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    setActiveSection(section);
    
    // Handle special navigation cases
    if (section === 'profile') {
      setCurrentPage('profile');
    } else if (currentPage !== 'app' && currentPage !== 'document-detail') {
      setCurrentPage('app');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
    setActiveSection('about');
  };

  const handleNavigateToHome = () => {
    setCurrentPage('app');
    setActiveSection('about');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return <AboutPage onNavigateToMembers={() => setActiveSection('members')} />;
      case 'members':
        return <MembersPage />;
      case 'documents':
        return <DocumentsSection onDocumentClick={() => setCurrentPage('document-detail')} />;
      case 'chat':
        return <ChatSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <AboutPage onNavigateToMembers={() => setActiveSection('members')} />;
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
        return <CreateTeamPage onNavigate={handleNavigate} />;
      
      case 'team-setup':
        return <TeamSetupPage onNavigate={handleNavigate} />;
      
      case 'join-team':
        return <JoinTeamPage onNavigate={handleNavigate} />;
      
      case 'app':
        return (
          <div className="h-screen flex flex-col bg-background">
            <TopNav 
              onNavigateToProfile={() => setCurrentPage('profile')}
              onLogout={handleLogout}
              onNavigateToHome={handleLogout}
            />
            
            <div className="flex flex-1 overflow-hidden">
              <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
              
              <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1200px] mx-auto p-8">
                  {renderSection()}
                </div>
              </main>
            </div>

            <DocumentUploadModal 
              open={showUploadModal} 
              onOpenChange={setShowUploadModal} 
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
            />
            
            <div className="flex flex-1 overflow-hidden">
              <Sidebar 
                activeSection="documents" 
                onSectionChange={(section) => {
                  setActiveSection(section);
                  setCurrentPage('app');
                }} 
              />
              
              <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1200px] mx-auto p-8">
                  <DocumentDetailPage onNavigate={(page) => {
                    if (page === 'documents') {
                      setActiveSection('documents');
                      setCurrentPage('app');
                    }
                  }} />
                </div>
              </main>
            </div>

            <DocumentUploadModal 
              open={showUploadModal} 
              onOpenChange={setShowUploadModal} 
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
            />
            
            <div className="flex flex-1 overflow-hidden">
              <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
              
              <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1200px] mx-auto p-8">
                  <ProfilePage />
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
