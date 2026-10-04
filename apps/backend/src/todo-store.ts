import { randomUUID } from 'node:crypto';

import type { Todo } from './types.js';

export class TodoStore {
  private todos: Todo[] = [];

  list(): Todo[] {
    return this.todos.map((todo) => ({ ...todo }));
  }

  create(title: string): Todo {
    const todo = { id: randomUUID(), title, completed: false };
    this.todos.push(todo);
    return { ...todo };
  }

  updateCompleted(id: string, completed: boolean): Todo | undefined {
    const todo = this.todos.find((candidate) => candidate.id === id);
    if (!todo) return undefined;

    todo.completed = completed;
    return { ...todo };
  }

  delete(id: string): boolean {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) return false;

    this.todos.splice(index, 1);
    return true;
  }
}
