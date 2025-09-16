import { Todo } from '../schemas/todo.contracts';

export function makeNewTodo(description: string): Todo {
  return {
    id: crypto.randomUUID(),
    description,
    createdAt: new Date().toISOString(),
  };
}
