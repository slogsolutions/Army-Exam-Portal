const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export type LoginResponse = {
  access: string;
  refresh: string;
  user?: {
    user_type?: 'admin' | 'evaluator' | 'candidate';
  }
};

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 401) {
    // try refresh once
    const refresh = localStorage.getItem('refreshToken');
    if (refresh) {
      const refreshRes = await fetch(`${API_URL}/api/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json() as { access: string };
        if (data.access) {
          localStorage.setItem('accessToken', data.access);
          headers.set('Authorization', `Bearer ${data.access}`);
          response = await fetch(`${API_URL}${path}`, { ...options, headers });
        }
      } else {
        // refresh failed, force logout state
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Login failed: ${response.status}`);
  }
  return response.json() as Promise<LoginResponse>;
}

export type Profile = {
  id: number;
  username: string;
  user_type: 'admin' | 'evaluator' | 'candidate';
};

export function getApiBaseUrl(): string {
  return API_URL;
}

export async function getProfile(): Promise<Profile> {
  return apiFetch<Profile>(`/api/auth/profile/`);
}

// Exams
export type Exam = {
  id: number;
  title: string;
  description?: string;
  duration_minutes: number;
  total_marks: number;
  is_active: boolean;
};

export async function listExams(): Promise<Exam[]> {
  return apiFetch<Exam[]>(`/api/exams/`);
}

export async function createExam(payload: Partial<Exam>): Promise<Exam> {
  return apiFetch<Exam>(`/api/exams/`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function deleteExam(id: number): Promise<void> {
  await apiFetch<void>(`/api/exams/${id}/`, { method: 'DELETE' });
}

export async function updateExam(id: number, payload: Partial<Exam>): Promise<Exam> {
  return apiFetch<Exam>(`/api/exams/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

// Admin users
export type AdminUser = {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  user_type?: string;
  is_active: boolean;
};

export async function listUsers(): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>(`/api/auth/users/`);
}

export async function createUser(payload: Partial<AdminUser> & { password?: string }): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/api/auth/users/`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateUser(id: number, payload: Partial<AdminUser>): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/api/auth/users/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function deleteUser(id: number): Promise<void> {
  await apiFetch<void>(`/api/auth/users/${id}/`, { method: 'DELETE' });
}

// Question bank
export type Question = {
  id: number;
  question_text: string;
  question_type: string;
  difficulty?: string;
  marks?: number;
};

export async function listQuestions(): Promise<Question[]> {
  return apiFetch<Question[]>(`/api/questions/`);
}

export async function createQuestion(payload: Partial<Question>): Promise<Question> {
  return apiFetch<Question>(`/api/questions/`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// Candidates
export type Candidate = {
  id: number;
  name: string;
  army_number: string;
  center?: number;
};

export async function registerCandidate(payload: Partial<Candidate>): Promise<Candidate> {
  return apiFetch<Candidate>(`/api/candidates/`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}


