import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { FileText, Upload, Clock, User, Trash2 } from 'lucide-react';
import { DocumentUploadModal } from './DocumentUploadModal';
import { fetchTeamDocuments, deleteDocument } from '../api/documents';
import { toast } from 'sonner@2.0.3';

interface DocumentsSectionProps {
  onDocumentClick?: (documentId: string) => void;
  teamId?: string;
}

export function DocumentsSection({ onDocumentClick, teamId }: DocumentsSectionProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isCreator, setIsCreator] = useState(false);
  const [removingDocId, setRemovingDocId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (teamId) {
      loadDocuments();
    }
  }, [teamId]);

  const loadDocuments = async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      const data = await fetchTeamDocuments(teamId);
      setDocuments(data?.documents || []);
      setIsCreator(data?.createdBy === data?.currentUserId);
    } catch (err: any) {
      toast.error('Failed to load documents', {
        description: err.message || 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    return `${Math.floor(diffDays / 365)} ${Math.floor(diffDays / 365) === 1 ? 'year' : 'years'} ago`;
  };

  const getTagDisplayName = (tag: string) => {
    const tagMap: { [key: string]: string } = {
      'design-doc': 'Design Doc',
      'api-spec': 'API Spec',
      'runbook': 'Runbook',
      'guide': 'Guide',
      'reference': 'Reference',
      'other': 'Other'
    };
    return tagMap[tag] || tag || 'Other';
  };

  const getColorClass = (tag: string) => {
    const colorMap: { [key: string]: string } = {
      'design-doc': 'from-primary to-primary/60',
      'api-spec': 'from-accent to-accent/60',
      'runbook': 'from-success to-success/60',
      'guide': 'from-warning to-warning/60',
      'reference': 'from-destructive to-destructive/60',
      'other': 'from-purple-500 to-purple-400'
    };
    return colorMap[tag] || 'from-primary to-primary/60';
  };

  const handleDeleteClick = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocToDelete(docId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!docToDelete) return;

    try {
      setRemovingDocId(docToDelete);
      await deleteDocument(docToDelete);
      toast.success('Document removed successfully');
      // Reload documents
      loadDocuments();
      setDeleteDialogOpen(false);
      setDocToDelete(null);
    } catch (err: any) {
      toast.error('Failed to remove document', {
        description: err.message || 'Please try again'
      });
    } finally {
      setRemovingDocId(null);
    }
  };

  const handleUploadComplete = () => {
    // Reload documents after upload
    loadDocuments();
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600">Loading documents...</p>
        </div>
      </div>
    );
  }

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

        {documents.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No documents yet</p>
            <p className="text-sm">Upload documents to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Card 
                key={doc.id} 
                className="p-6 rounded-3xl border-border shadow-lg hover:shadow-xl hover:border-primary/20 transition-all group bg-card"
              >
              <div 
                className="cursor-pointer"
                onClick={() => onDocumentClick?.(doc.id)}
              >
                  <div className="flex justify-center mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getColorClass(doc.tag)} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <div className="flex justify-center mb-3">
                    <Badge variant="secondary" className="rounded-lg bg-slate-100">
                      {getTagDisplayName(doc.tag)}
                    </Badge>
                  </div>

                  <h3 className="mb-2 line-clamp-1 text-center">{doc.title}</h3>
                  <p className="text-slate-600 mb-6 line-clamp-2 leading-relaxed text-center">
                    {doc.summary || 'No description'}
                  </p>

                  <div className="flex items-center justify-center gap-4 text-sm text-slate-500 pt-4 border-t border-slate-100 mb-5">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      <span className="truncate">{doc.uploadedBy?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{formatRelativeTime(doc.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {isCreator && (
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
                    onClick={(e) => handleDeleteClick(doc.id, e)}
                    disabled={removingDocId === doc.id}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {removingDocId === doc.id ? 'Removing...' : 'Remove'}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <DocumentUploadModal 
        open={showUploadModal} 
        onOpenChange={setShowUploadModal}
        teamId={teamId}
        onUploadComplete={handleUploadComplete}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Document</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to remove this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel 
              className="rounded-xl border-slate-200 hover:bg-slate-50"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDocToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="rounded-xl bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
