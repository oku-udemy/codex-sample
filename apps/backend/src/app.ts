import cors from 'cors';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

import { TodoStore } from './todo-store.js';
import type { ApiErrorBody } from './types.js';

function errorBody(code: string, message: string): ApiErrorBody {
  return { error: { code, message } };
}

export function createApp(store = new TodoStore()) {
  const app = express();
  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  app.get('/api/todos', (_request, response) => {
    response.json(store.list());
  });

  app.post('/api/todos', (request, response) => {
    const title =
      typeof request.body?.title === 'string' ? request.body.title.trim() : '';
    if (!title) {
      response
        .status(400)
        .json(errorBody('INVALID_TITLE', 'タイトルを入力してください。'));
      return;
    }

    response.status(201).json(store.create(title));
  });

  app.patch('/api/todos/:id', (request, response) => {
    if (typeof request.body?.completed !== 'boolean') {
      response
        .status(400)
        .json(
          errorBody(
            'INVALID_COMPLETED',
            'completedには真偽値を指定してください。',
          ),
        );
      return;
    }

    const todo = store.updateCompleted(
      request.params.id,
      request.body.completed,
    );
    if (!todo) {
      response
        .status(404)
        .json(errorBody('TODO_NOT_FOUND', 'Todoが見つかりません。'));
      return;
    }

    response.json(todo);
  });

  app.delete('/api/todos/:id', (request, response) => {
    if (!store.delete(request.params.id)) {
      response
        .status(404)
        .json(errorBody('TODO_NOT_FOUND', 'Todoが見つかりません。'));
      return;
    }

    response.status(204).send();
  });

  app.use('/api', (_request, response) => {
    response
      .status(404)
      .json(errorBody('NOT_FOUND', 'APIエンドポイントが見つかりません。'));
  });

  app.use(
    (
      error: unknown,
      _request: Request,
      response: Response,
      _next: NextFunction,
    ) => {
      void _next;
      console.error(error);
      response
        .status(500)
        .json(errorBody('INTERNAL_ERROR', 'サーバーでエラーが発生しました。'));
    },
  );

  return app;
}
