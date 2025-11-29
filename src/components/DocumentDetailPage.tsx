import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Share2, 
  MoreVertical,
  User,
  Calendar,
  Clock,
  MessageSquare,
  Tag,
  Trash2
} from 'lucide-react';

interface DocumentDetailPageProps {
  onNavigate: (page: string) => void;
}

export function DocumentDetailPage({ onNavigate }: DocumentDetailPageProps) {
  const document = {
    title: 'API Documentation v2.1',
    tag: 'API Spec',
    summary: 'Complete API reference guide with endpoints, authentication methods, and code examples for integrating with our platform.',
    uploader: 'Mike Johnson',
    uploadDate: 'March 15, 2024',
    lastUpdated: '5 hours ago',
    version: '2.1.0',
    fileSize: '2.4 MB',
    views: 156,
    chatReferences: 42
  };

  const referencedBy = [
    { title: 'Mobile App Integration Guide', tag: 'Guide' },
    { title: 'Authentication Best Practices', tag: 'Design Doc' },
    { title: 'Deployment Runbook', tag: 'Runbook' }
  ];

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
              {document.tag}
            </Badge>
          </div>
          <p className="text-slate-600">{document.summary}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-primary/10">
            <Download className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-primary/10">
            <Share2 className="w-5 h-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-primary/10">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive rounded-lg cursor-pointer"
                onClick={() => {
                  // Handle delete
                  onNavigate('documents');
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 rounded-3xl border-border shadow-lg bg-card min-h-[600px]">
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
                <Button className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20 gap-2">
                  <FileText className="w-4 h-4" />
                  Tap to view document
                </Button>
              </div>
            </div>
          </Card>

          {/* Referenced By */}
          <Card className="p-6 rounded-3xl border-border shadow-lg bg-card">
            <h3 className="mb-4">Referenced By</h3>
            <p className="text-slate-600 mb-4">
              Other documents that reference or link to this document
            </p>
            <div className="space-y-2">
              {referencedBy.map((doc, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl hover:border-primary/20 transition-all cursor-pointer border border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p>{doc.title}</p>
                        <Badge variant="outline" className="rounded-lg mt-1 border-slate-200">
                          {doc.tag}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  <p>{document.uploader}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-500 text-sm">Upload date</p>
                  <p>{document.uploadDate}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-500 text-sm">Last updated</p>
                  <p>{document.lastUpdated}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-500 text-sm">Version</p>
                  <p>{document.version}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-500 text-sm">File size</p>
                  <p>{document.fileSize}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl border-border shadow-lg bg-card">
            <h3 className="mb-4">Usage Stats</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-600">Total Views</span>
                  <span>{document.views}</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span>Used by AI Chat</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Referenced in <span className="text-primary">{document.chatReferences} conversations</span>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
