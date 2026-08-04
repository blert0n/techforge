import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./client";

async function runMigrations() {
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });

  console.log("Migrations applied successfully.");
}

runMigrations().catch((error) => {
  console.error("Failed to apply migrations", error);
  process.exit(1);
});
