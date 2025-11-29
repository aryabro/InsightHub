import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Upload, Clock, User, Trash2 } from 'lucide-react';
import { DocumentUploadModal } from './DocumentUploadModal';

interface DocumentsSectionProps {
  onDocumentClick?: () => void;
}

export function DocumentsSection({ onDocumentClick }: DocumentsSectionProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documents, setDocuments] = useState([
    {
      title: 'Q4 Product Roadmap',
      description: 'Comprehensive roadmap for Q4 2024 product releases and features',
      author: 'Sarah Chen',
      updated: '2 hours ago',
      category: 'Planning',
      color: 'from-primary to-primary/60'
    },
    {
      title: 'API Documentation v2.1',
      description: 'Complete API reference guide with examples and best practices',
      author: 'Mike Johnson',
      updated: '5 hours ago',
      category: 'Technical',
      color: 'from-accent to-accent/60'
    },
    {
      title: 'Design System Guidelines',
      description: 'Brand guidelines, components library, and design tokens',
      author: 'Emma Wilson',
      updated: '1 day ago',
      category: 'Design',
      color: 'from-success to-success/60'
    },
    {
      title: 'Team Onboarding Guide',
      description: 'Everything new team members need to know to get started',
      author: 'Chris Martinez',
      updated: '2 days ago',
      category: 'HR',
      color: 'from-warning to-warning/60'
    },
    {
      title: 'Security Best Practices',
      description: 'Security guidelines and compliance requirements',
      author: 'Alex Kim',
      updated: '3 days ago',
      category: 'Security',
      color: 'from-destructive to-destructive/60'
    },
    {
      title: 'Q3 Retrospective',
      description: 'Team retrospective and learnings from Q3',
      author: 'Jordan Taylor',
      updated: '1 week ago',
      category: 'Planning',
      color: 'from-purple-500 to-purple-400'
    },
  ]);

  const handleDeleteDocument = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocuments(documents.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Team Documents</h1>
            <p className="text-slate-600">
              Centralized knowledge base for the team
            </p>
          </div>
          <Button 
            className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, index) => (
            <Card 
              key={index} 
              className="p-6 rounded-3xl border-border shadow-lg hover:shadow-xl hover:border-primary/20 transition-all group bg-card"
            >
              <div 
                className="cursor-pointer"
                onClick={onDocumentClick}
              >
                <div className="flex justify-center mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${doc.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="flex justify-center mb-3">
                  <Badge variant="secondary" className="rounded-lg bg-slate-100">
                    {doc.category}
                  </Badge>
                </div>

                <h3 className="mb-2 line-clamp-1 text-center">{doc.title}</h3>
                <p className="text-slate-600 mb-6 line-clamp-2 leading-relaxed text-center">
                  {doc.description}
                </p>

                <div className="flex items-center justify-center gap-4 text-sm text-slate-500 pt-4 border-t border-slate-100 mb-5">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span className="truncate">{doc.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{doc.updated}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
                onClick={(e) => handleDeleteDocument(index, e)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <DocumentUploadModal 
        open={showUploadModal} 
        onOpenChange={setShowUploadModal} 
      />
    </>
  );
}
