import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { createApp } from '../src/app.js';
import { TodoStore } from '../src/todo-store.js';

describe('Todo API', () => {
  let store: TodoStore;

  beforeEach(() => {
    store = new TodoStore();
  });

  it('Todoを作成順で一覧取得する', async () => {
    store.create('最初');
    store.create('次');

    const response = await request(createApp(store)).get('/api/todos');

    expect(response.status).toBe(200);
    expect(response.body.map((todo: { title: string }) => todo.title)).toEqual([
      '最初',
      '次',
    ]);
  });

  it('前後の空白を除いたタイトルでTodoを作成する', async () => {
    const response = await request(createApp(store))
      .post('/api/todos')
      .send({ title: '  買い物  ' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ title: '買い物', completed: false });
    expect(response.body.id).toEqual(expect.any(String));
  });

  it('空のタイトルを拒否する', async () => {
    const response = await request(createApp(store))
      .post('/api/todos')
      .send({ title: '   ' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_TITLE');
  });

  it('Todoの完了状態を更新する', async () => {
    const todo = store.create('テスト');
    const response = await request(createApp(store))
      .patch(`/api/todos/${todo.id}`)
      .send({ completed: true });

    expect(response.status).toBe(200);
    expect(response.body.completed).toBe(true);
  });

  it('不正な完了状態を拒否する', async () => {
    const todo = store.create('テスト');
    const response = await request(createApp(store))
      .patch(`/api/todos/${todo.id}`)
      .send({ completed: 'yes' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_COMPLETED');
  });

  it('Todoを削除する', async () => {
    const todo = store.create('削除対象');
    const response = await request(createApp(store)).delete(
      `/api/todos/${todo.id}`,
    );

    expect(response.status).toBe(204);
    expect(store.list()).toEqual([]);
  });

  it.each(['patch', 'delete'] as const)(
    '存在しないTodoへの%sを404にする',
    async (method) => {
      const agent = request(createApp(store));
      const response =
        method === 'patch'
          ? await agent.patch('/api/todos/missing').send({ completed: true })
          : await agent.delete('/api/todos/missing');

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('TODO_NOT_FOUND');
    },
  );
});
