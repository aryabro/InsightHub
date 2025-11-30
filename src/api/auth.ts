const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

type SignupPayload = {
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
  timezone?: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

async function handleResponse(res: Response) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || "Something went wrong";
    throw new Error(message);
  }

  return data;
}

export async function signup(payload: SignupPayload) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(res);
}

export async function login(payload: LoginPayload) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(res);
}

export function storeAuth(token: string, user: any) {
  localStorage.setItem("insighthub_token", token);
  localStorage.setItem("insighthub_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("insighthub_token");
  localStorage.removeItem("insighthub_user");
}

export function getStoredAuth() {
  const token = localStorage.getItem("insighthub_token");
  const userRaw = localStorage.getItem("insighthub_user");
  let user: any = null;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  return { token, user };
}

export function getAuthHeader() {
  const token = localStorage.getItem("insighthub_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    }
  });

  return handleResponse(res);
}

export async function updateProfile(payload: {
  fullName?: string;
  phone?: string;
  role?: string;
  timezone?: string;
}) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(res);
}


