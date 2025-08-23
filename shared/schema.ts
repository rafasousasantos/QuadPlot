import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const savedFunctions = pgTable("saved_functions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  expression: text("expression").notNull(),
  parameters: jsonb("parameters").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSavedFunctionSchema = createInsertSchema(savedFunctions).pick({
  name: true,
  expression: true,
  parameters: true,
});

export type InsertSavedFunction = z.infer<typeof insertSavedFunctionSchema>;
export type SavedFunction = typeof savedFunctions.$inferSelect;
