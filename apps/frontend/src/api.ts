import type { ApiErrorBody, Todo } from './types';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: init?.body
      ? { 'Content-Type': 'application/json', ...init.headers }
      : init?.headers,
  });

  if (!response.ok) {
    let message = '通信に失敗しました。時間をおいて再度お試しください。';
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body.error?.message) message = body.error.message;
    } catch {
      // JSONではないエラー応答には既定メッセージを使用する。
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const todoApi = {
  list: () => request<Todo[]>('/api/todos'),
  create: (title: string) =>
    request<Todo>('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),
  updateCompleted: (id: string, completed: boolean) =>
    request<Todo>(`/api/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    }),
  delete: (id: string) =>
    request<void>(`/api/todos/${id}`, { method: 'DELETE' }),
};
