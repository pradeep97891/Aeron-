import { pgTable, text, serial, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  flightNumber: varchar("flight_number", { length: 10 }).notNull(),
  aircraft: varchar("aircraft", { length: 20 }).notNull(),
  origin: varchar("origin", { length: 3 }).notNull(),
  destination: varchar("destination", { length: 3 }).notNull(),
  originName: varchar("origin_name", { length: 50 }).notNull(),
  destinationName: varchar("destination_name", { length: 50 }).notNull(),
  departureTime: varchar("departure_time", { length: 5 }).notNull(),
  departureDate: varchar("departure_date", { length: 10 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(), // Cancelled, Delayed, Diverted
  statusDetail: varchar("status_detail", { length: 20 }), // +120m, +180m etc
  priority: varchar("priority", { length: 10 }).notNull(), // Critical, High, Medium
  passengers: integer("passengers").notNull(),
  connections: integer("connections").notNull(),
  impactSeverity: varchar("impact_severity", { length: 20 }).notNull(), // high severity, medium severity
  impactTimestamp: timestamp("impact_timestamp").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
  updatedAt: true,
});

export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Flight = typeof flights.$inferSelect;
