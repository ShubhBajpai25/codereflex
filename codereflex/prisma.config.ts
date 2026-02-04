// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // For Neon, use your POOLED url here for general CLI use
    url: env("DATABASE_URL"), 
    directUrl: env("DIRECT_URL",)
  },
});