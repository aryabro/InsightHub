import { getAuthHeader } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

type CreateTeamPayload = {
  name: string;
  description?: string;
  mission?: string;
  standupTime?: string;
  timezone?: string;
  isPrivate?: boolean;
};

async function handleResponse(res: Response) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || "Something went wrong";
    throw new Error(message);
  }

  return data;
}

export async function createTeam(payload: CreateTeamPayload) {
  const res = await fetch(`${API_BASE}/api/teams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(res);
}

export async function addTeamMembers(teamId: string, emails: string[]) {
  const res = await fetch(`${API_BASE}/api/teams/${teamId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify({ emails })
  });

  return handleResponse(res);
}

export async function fetchMyTeams() {
  const res = await fetch(`${API_BASE}/api/teams/my`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    }
  });

  return handleResponse(res);
}

export async function fetchTeam(teamId: string) {
  const res = await fetch(`${API_BASE}/api/teams/${teamId}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    }
  });

  return handleResponse(res);
}

export async function updateTeam(teamId: string, payload: {
  name?: string;
  description?: string;
  mission?: string;
  standupTime?: string;
  timezone?: string;
  slackChannel?: string;
  email?: string;
  isPrivate?: boolean;
}) {
  const res = await fetch(`${API_BASE}/api/teams/${teamId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(res);
}

export async function fetchTeamMembers(teamId: string) {
  const res = await fetch(`${API_BASE}/api/teams/${teamId}/members`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    }
  });

  return handleResponse(res);
}

export async function removeTeamMember(teamId: string, userId: string) {
  const res = await fetch(`${API_BASE}/api/teams/${teamId}/members/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    }
  });

  return handleResponse(res);
}

export async function fetchPublicTeams() {
  const res = await fetch(`${API_BASE}/api/teams/public`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    }
  });

  return handleResponse(res);
}

export async function joinTeam(inviteCode?: string, teamId?: string) {
  const res = await fetch(`${API_BASE}/api/teams/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify({ inviteCode, teamId })
  });

  return handleResponse(res);
}


