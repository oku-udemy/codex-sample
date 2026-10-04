import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { App } from '../src/App';

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

describe('App', () => {
  it('読み込み中の表示後にTodo一覧を表示する', async () => {
    let resolveRequest: ((response: Response) => void) | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolveRequest = resolve;
          }),
      ),
    );

    render(<App />);
    expect(screen.getByText('読み込み中…')).toBeInTheDocument();

    resolveRequest?.(
      jsonResponse([{ id: '1', title: '既存のTodo', completed: false }]),
    );
    expect(await screen.findByText('既存のTodo')).toBeInTheDocument();
  });

  it('Todoを追加する', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(
        jsonResponse(
          { id: '1', title: '牛乳を買う', completed: false },
          { status: 201 },
        ),
      );
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<App />);
    await screen.findByText('Todoはまだありません。');
    await user.type(screen.getByLabelText('新しいTodo'), '牛乳を買う');
    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(await screen.findByText('牛乳を買う')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenLastCalledWith(
      'http://localhost:3001/api/todos',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ title: '牛乳を買う' }),
      }),
    );
  });

  it('Todoの完了状態を切り替える', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse([{ id: '1', title: '散歩', completed: false }]),
      )
      .mockResolvedValueOnce(
        jsonResponse({ id: '1', title: '散歩', completed: true }),
      );
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<App />);
    await user.click(await screen.findByRole('checkbox', { name: '散歩' }));

    await waitFor(() =>
      expect(screen.getByRole('checkbox', { name: '散歩' })).toBeChecked(),
    );
    expect(screen.getByText('1 / 1 件完了')).toBeInTheDocument();
  });

  it('Todoを削除する', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse([{ id: '1', title: '読書', completed: false }]),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<App />);
    await user.click(await screen.findByRole('button', { name: '読書を削除' }));

    await waitFor(() =>
      expect(screen.queryByText('読書')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Todoはまだありません。')).toBeInTheDocument();
  });

  it('APIエラーを表示する', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: 'INTERNAL_ERROR',
              message: 'サーバーでエラーが発生しました。',
            },
          },
          { status: 500 },
        ),
      ),
    );

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'サーバーでエラーが発生しました。',
    );
  });
});
