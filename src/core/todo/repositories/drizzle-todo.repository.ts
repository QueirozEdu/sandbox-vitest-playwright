import { DrizzleDatabase } from '@/db';
import { TodoRepository } from './todo.contract.repository';
import { todoTable } from '../schemas/drizzle-todo-table.schema';
import { eq } from 'drizzle-orm';
import { Todo, TodoPresenter } from '../schemas/todo.contracts';

export class DrizzleTodoRepository implements TodoRepository {
  private readonly db: DrizzleDatabase;

  constructor(db: DrizzleDatabase) {
    this.db = db;
  }

  async findAll(): Promise<Todo[]> {
    const todos = await this.db.query.todo.findMany({
      orderBy: (todo, { desc }) => [
        desc(todo.createdAt),
        desc(todo.description),
      ],
    });

    return todos;
  }
  async create(todoData: Todo): Promise<TodoPresenter> {
    const existingTodo = await this.db.query.todo.findFirst({
      where: (todoTable, { eq, or }) =>
        or(
          eq(todoTable.id, todoData.id),
          eq(todoTable.description, todoData.description)
        ),
    });

    if (!!existingTodo) {
      return {
        success: false,
        errors: ['A TODO with this ID or description already exists'],
      };
    }

    await this.db.insert(todoTable).values(todoData);
    return { success: true, todo: todoData };
  }

  async remove(id: string): Promise<TodoPresenter> {
    const existingTodo = await this.db.query.todo.findFirst({
      where: (todoTable, { eq }) => eq(todoTable.id, id),
    });

    if (!existingTodo) {
      return {
        success: false,
        errors: ['TODO does not exist'],
      };
    }

    await this.db.delete(todoTable).where(eq(todoTable.id, id));

    return {
      success: true,
      todo: existingTodo,
    };
  }
}
