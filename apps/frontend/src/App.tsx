import { type FormEvent, useEffect, useState } from 'react';

import { todoApi } from './api';
import type { Todo } from './types';

function messageFrom(error: unknown): string {
  return error instanceof Error
    ? error.message
    : '予期しないエラーが発生しました。';
}

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    todoApi
      .list()
      .then((items) => {
        if (active) setTodos(items);
      })
      .catch((cause: unknown) => {
        if (active) setError(messageFrom(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function addTodo(event: FormEvent) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setSaving(true);
    setError(null);
    try {
      const created = await todoApi.create(trimmedTitle);
      setTodos((current) => [...current, created]);
      setTitle('');
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setSaving(false);
    }
  }

  async function toggleTodo(todo: Todo) {
    setError(null);
    try {
      const updated = await todoApi.updateCompleted(todo.id, !todo.completed);
      setTodos((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (cause) {
      setError(messageFrom(cause));
    }
  }

  async function deleteTodo(todo: Todo) {
    setError(null);
    try {
      await todoApi.delete(todo.id);
      setTodos((current) => current.filter((item) => item.id !== todo.id));
    } catch (cause) {
      setError(messageFrom(cause));
    }
  }

  return (
    <main className="app-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <header>
          <p className="eyebrow">MY DAILY LIST</p>
          <h1 id="page-title">今日のTodo</h1>
          <p className="subtitle">小さな予定を、ひとつずつ片づけよう。</p>
        </header>

        <form className="todo-form" onSubmit={addTodo}>
          <label className="sr-only" htmlFor="todo-title">
            新しいTodo
          </label>
          <input
            id="todo-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="新しいTodoを入力"
            autoComplete="off"
          />
          <button type="submit" disabled={saving || !title.trim()}>
            {saving ? '追加中…' : '追加'}
          </button>
        </form>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <p className="status" aria-live="polite">
            読み込み中…
          </p>
        ) : todos.length === 0 ? (
          <p className="status">Todoはまだありません。</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={todo.completed ? 'completed' : undefined}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => void toggleTodo(todo)}
                  />
                  <span>{todo.title}</span>
                </label>
                <button
                  className="delete-button"
                  type="button"
                  onClick={() => void deleteTodo(todo)}
                  aria-label={`${todo.title}を削除`}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}

        {!loading && todos.length > 0 && (
          <footer>
            {todos.filter((todo) => todo.completed).length} / {todos.length}{' '}
            件完了
          </footer>
        )}
      </section>
    </main>
  );
}
