// Make sure to install the 'postgres' package
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error("DB_URL environment variable is not set");
}

const queryClient = postgres(DB_URL);
export const db = drizzle({ client: queryClient, schema });

// Export the schema for use in other files
export * from "./schema";
