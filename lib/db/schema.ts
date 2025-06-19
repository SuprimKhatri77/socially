import { pgTable, uuid } from "drizzle-orm/pg-core";

export const dummyTable = pgTable("dummy_table", {
  id: uuid().primaryKey().notNull(),
});
