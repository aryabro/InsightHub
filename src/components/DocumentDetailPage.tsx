import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
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
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  User,
  Calendar
} from 'lucide-react';
import { fetchDocument, deleteDocument, downloadDocument, getDocumentPreviewUrl } from '../api/documents';
import { getStoredAuth } from '../api/auth';
import { toast } from 'sonner@2.0.3';

interface DocumentDetailPageProps {
  onNavigate: (page: string) => void;
  documentId?: string;
}

export function DocumentDetailPage({ onNavigate, documentId }: DocumentDetailPageProps) {
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState<any | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (documentId) {
      loadDocument();
    }
  }, [documentId]);

  // Cleanup blob URL when component unmounts or preview closes
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  // Cleanup when closing preview
  useEffect(() => {
    if (!showPreview && pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  }, [showPreview, pdfBlobUrl]);

  const loadDocument = async () => {
    if (!documentId) return;
    
    try {
      setLoading(true);
      const data = await fetchDocument(documentId);
      const doc = data?.document;
      
      if (doc) {
        setDocument(doc);
        setIsCreator(doc.createdBy === doc.currentUserId);
      }
    } catch (err: any) {
      toast.error('Failed to load document', {
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

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
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

  const handleDownload = async () => {
    if (!documentId) return;
    
    try {
      setIsDownloading(true);
      await downloadDocument(documentId);
      toast.success('Download started', {
        description: 'Your document is being downloaded'
      });
    } catch (err: any) {
      toast.error('Failed to download document', {
        description: err.message || 'Please try again'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewDocument = async () => {
    if (!documentId) {
      toast.error('Document ID not available');
      return;
    }
    try {
      // Fetch the PDF as a blob and create a blob URL
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const { token } = getStoredAuth();
      if (!token) {
        throw new Error("Not authenticated - please log in again");
      }

      const previewUrl = `${API_BASE}/api/documents/${documentId}/preview?token=${encodeURIComponent(token)}`;
      console.log('Fetching preview from:', previewUrl);

      const response = await fetch(previewUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load preview: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setPdfBlobUrl(blobUrl);
      setPreviewUrl(previewUrl);
      setShowPreview(true);
      setPreviewError(false);
    } catch (err: any) {
      console.error('Preview error:', err);
      setPreviewError(true);
      toast.error('Failed to load preview', {
        description: err.message || 'Please try downloading the document instead'
      });
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentId) return;

    try {
      setIsDeleting(true);
      await deleteDocument(documentId);
      toast.success('Document deleted successfully');
      setDeleteDialogOpen(false);
      onNavigate('documents');
    } catch (err: any) {
      toast.error('Failed to delete document', {
        description: err.message || 'Please try again'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600">Document not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl text-slate-700 hover:text-slate-900"
          onClick={() => onNavigate('documents')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1>{document.title}</h1>
            <Badge variant="secondary" className="rounded-lg bg-slate-100">
              {getTagDisplayName(document.tag)}
            </Badge>
          </div>
          <p className="text-slate-600">{document.summary || 'No description provided'}</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-xl border-slate-200 hover:bg-primary/10"
          onClick={handleDownload}
          disabled={isDownloading}
          title="Download document"
        >
          <Download className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 rounded-3xl border-border shadow-lg bg-card min-h-[600px]">
            {!showPreview ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="mb-2">Document Preview</h3>
                  <p className="text-slate-600 mb-6">
                    Preview functionality would display the document content here.<br />
                    Supports PDF, Markdown, and text files.
                  </p>
                  <Button 
                    onClick={handleViewDocument}
                    className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20 gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Tap to view document
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Document Preview</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(false)}
                    className="rounded-lg"
                  >
                    Close Preview
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden bg-slate-50 rounded-xl border border-slate-200">
                  {pdfBlobUrl && !previewError ? (
                    <iframe
                      key={pdfBlobUrl}
                      src={pdfBlobUrl}
                      className="w-full h-full border-0"
                      title="Document Preview"
                      style={{ minHeight: '600px' }}
                      allow="fullscreen"
                      onLoad={() => {
                        console.log('PDF preview loaded successfully');
                        setPreviewError(false);
                      }}
                      onError={() => {
                        console.error('Iframe load error');
                        setPreviewError(true);
                        toast.error('Failed to load document preview. Please try downloading the document instead.');
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6">
                      <FileText className="w-16 h-16 text-slate-400 mb-4" />
                      <p className="text-slate-600 mb-2">
                        {previewError ? 'Unable to load document preview' : 'Unable to load document preview'}
                      </p>
                      <p className="text-sm text-slate-500 mb-4">
                        {previewError ? 'The document preview could not be loaded. Please try downloading the document instead.' : 'Document ID not available'}
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="rounded-xl"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isDownloading ? 'Downloading...' : 'Download Document'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar - Metadata */}
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl border-border shadow-lg bg-card">
            <h3 className="mb-6">Document Info</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-500 text-sm">Uploaded by</p>
                  <p>{document.uploadedBy?.name || 'Unknown'}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-500 text-sm">Upload time</p>
                  <p>{formatRelativeTime(document.createdAt)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-500 text-sm">File size</p>
                  <p>{formatFileSize(document.fileSize)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Document</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel 
              className="rounded-xl border-slate-200 hover:bg-slate-50"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="rounded-xl bg-destructive hover:bg-destructive/90 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
