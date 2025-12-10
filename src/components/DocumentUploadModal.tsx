import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FileUploader } from './FileUploader';
import { uploadDocument } from '../api/documents';
import { toast } from 'sonner@2.0.3';

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId?: string;
  onUploadComplete?: () => void;
}

export function DocumentUploadModal({ open, onOpenChange, teamId, onUploadComplete }: DocumentUploadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    tag: '',
    summary: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamId) {
      toast.error('Team ID is required');
      return;
    }

    if (!files.length) {
      toast.error('Please select a file');
      return;
    }

    const file = files[0];
    
    // Validate PDF file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are allowed');
      return;
    }

    try {
      setIsUploading(true);
      
      await uploadDocument({
        teamId,
        title: formData.title,
        tag: formData.tag,
        summary: formData.summary || undefined,
        file // Send the actual file
      });
      
      toast.success('Document uploaded successfully!', {});
      
      // Reset form
      setFormData({ title: '', tag: '', summary: '' });
      setFiles([]);
      onOpenChange(false);
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err: any) {
      toast.error('Failed to upload document', {
        description: err.message || 'Please try again'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a new PDF document to your team's knowledge base. Only PDF files are supported.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FileUploader onFilesSelect={setFiles} maxFiles={1} acceptedTypes="application/pdf,.pdf" />

          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., API Authentication Guide"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag">Document Tag</Label>
            <Select 
              value={formData.tag} 
              onValueChange={(value) => setFormData({ ...formData, tag: value })}
              required
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design-doc">Design Doc</SelectItem>
                <SelectItem value="api-spec">API Spec</SelectItem>
                <SelectItem value="runbook">Runbook</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground">
              Helps organize and categorize your documents
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary (Optional)</Label>
            <Textarea
              id="summary"
              placeholder="Brief overview of what this document covers..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="rounded-xl min-h-[80px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
              disabled={!files.length || !formData.title || !formData.tag || isUploading || !teamId}
            >
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
