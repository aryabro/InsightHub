import { getAuthHeader } from './auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface Notification {
  id: string;
  type: 'member_added' | 'member_removed' | 'document_uploaded' | 'team_updated';
  message: string;
  createdAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  relatedUser?: {
    id: string;
    name: string;
    email: string;
  } | null;
  relatedDocument?: {
    id: string;
    title: string;
    fileName: string;
  } | null;
}

export async function fetchTeamNotifications(teamId: string): Promise<{ notifications: Notification[] }> {
  const response = await fetch(`${API_BASE}/api/notifications/team/${teamId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch notifications' }));
    throw new Error(error.error || 'Failed to fetch notifications');
  }

  return response.json();
}

export async function deleteNotification(notificationId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to delete notification' }));
    throw new Error(error.error || 'Failed to delete notification');
  }
}

