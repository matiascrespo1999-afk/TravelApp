import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, decimal, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const trips = pgTable('trips', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  baseCurrency: text('base_currency').notNull().default('USD'),
  createdAt: timestamp('created_at').defaultNow(),
});
