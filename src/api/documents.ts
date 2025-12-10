import { getAuthHeader, getStoredAuth } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

type UploadDocumentPayload = {
  teamId: string;
  title: string;
  tag?: string;
  summary?: string;
  file: File; 
};

async function handleResponse(res: Response) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || "Something went wrong";
    throw new Error(message);
  }

  return data;
}

export async function uploadDocument(payload: UploadDocumentPayload) {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('teamId', payload.teamId);
  formData.append('title', payload.title);
  if (payload.tag) {
    formData.append('tag', payload.tag);
  }
  if (payload.summary) {
    formData.append('summary', payload.summary);
  }

  const authHeader = getAuthHeader();
  const res = await fetch(`${API_BASE}/api/documents`, {
    method: "POST",
    headers: {
      ...authHeader
    },
    body: formData
  });

  return handleResponse(res);
}

export async function fetchRecentDocuments(limit = 3) {
  const res = await fetch(`${API_BASE}/api/documents/recent?limit=${limit}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    }
  });

  return handleResponse(res);
}

export async function fetchTeamDocuments(teamId: string) {
  const res = await fetch(`${API_BASE}/api/documents/team/${teamId}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    }
  });

  return handleResponse(res);
}

export async function fetchDocument(documentId: string) {
  const res = await fetch(`${API_BASE}/api/documents/${documentId}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    }
  });

  return handleResponse(res);
}

export async function deleteDocument(documentId: string) {
  const res = await fetch(`${API_BASE}/api/documents/${documentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    }
  });

  return handleResponse(res);
}

export function getDocumentPreviewUrl(documentId: string): string {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
  try {
    const { token } = getStoredAuth();
    if (!token) {
      throw new Error("Not authenticated - please log in again");
    }
    // Return URL with token as query param for iframe (since we can't set headers in iframe)
    return `${API_BASE}/api/documents/${documentId}/preview?token=${encodeURIComponent(token)}`;
  } catch (err: any) {
    console.error('Error generating preview URL:', err);
    throw new Error(err.message || "Failed to generate preview URL");
  }
}

export async function downloadDocument(documentId: string) {
  const authHeader = getAuthHeader();
  const res = await fetch(`${API_BASE}/api/documents/${documentId}/download`, {
    headers: {
      ...authHeader
    }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = (data && (data.error || data.message)) || "Something went wrong";
    throw new Error(message);
  }

  // Get the filename from Content-Disposition header or use a default
  const contentDisposition = res.headers.get('Content-Disposition');
  let filename = 'document.pdf'; // Default to PDF
  
  if (contentDisposition) {
    // Try to get filename* first (RFC 5987 format: filename*=UTF-8''encoded-name)
    const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
    if (filenameStarMatch && filenameStarMatch[1]) {
      try {
        filename = decodeURIComponent(filenameStarMatch[1]);
      } catch (e) {
        // If decoding fails, try regular filename
      }
    }
    
    // If filename* didn't work, try regular filename
    if (filename === 'document.pdf') {
      // Match: filename="name" or filename=name
      const filenameMatch = contentDisposition.match(/filename=["']?([^"';]+)["']?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
        // Decode if it's URL-encoded
        try {
          filename = decodeURIComponent(filename);
        } catch (e) {
        }
      }
    }
  }
  
  if (!filename.toLowerCase().endsWith('.pdf')) {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    filename = `${nameWithoutExt}.pdf`;
  }

  // Create a blob and trigger download
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}



