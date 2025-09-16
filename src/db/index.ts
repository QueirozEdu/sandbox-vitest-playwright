import { todoTable } from '@/core/todo/schemas/drizzle-todo-table.schema';
import { getFullEnv } from '@/env/config';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const makeDrizzle = () => {
  const { databaseFile, currentEnv, drizzleMigrationsFolder } = getFullEnv();
  const sqliteDatabe = new Database(databaseFile);

  const db = drizzle(sqliteDatabe, {
    schema: { todo: todoTable },
  });

  if (['test', 'e2e'].includes(currentEnv)) {
    migrate(db, { migrationsFolder: drizzleMigrationsFolder });
  }

  return db;
};

declare global {
  //eslint-disabled-next-line no-var
  var __DB__: ReturnType<typeof makeDrizzle>;
}

if (!globalThis.__DB__) {
  globalThis.__DB__ = makeDrizzle();
}

export const drizzleDatabase = {
  db: globalThis.__DB__,
  todoTable,
};

export type DrizzleDatabase = ReturnType<typeof makeDrizzle>;

(async () => {
  const db = globalThis.__DB__;
  console.log(await db.query.todo.findMany());
})();
