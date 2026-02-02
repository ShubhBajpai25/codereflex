// seed-feb1.ts - Run this to seed February 1st, 2026 data
// You can execute this with: npx tsx seed-feb1.ts

import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

async function seedFeb1() {
  console.log('🌱 Seeding February 1st, 2026...');

  try {
    // Create the topic for February 1st
    const topic = await prisma.topic.create({
      data: {
        title: "The First Programmer Was a Woman",
        content: "The Ada programming language was named after Ada Lovelace, who wrote the first computer program in 1843. She created an algorithm for Charles Babbage's Analytical Engine to calculate Bernoulli numbers, making her the world's first computer programmer - a full century before the first modern computer was built.",
        miniDesc: "Ada Lovelace wrote the world's first computer program in 1843, over 100 years before modern computers existed!",
        tags: ["history", "pioneers", "programming"],
        type: "DAILY",
        publishedAt: new Date("2026-02-01T00:00:00.000Z"),
        citations: [
          "https://en.wikipedia.org/wiki/Ada_Lovelace",
          "Computer History Museum - Ada Lovelace"
        ],
      },
    });

    console.log('✅ Successfully created topic for Feb 1st, 2026');
    console.log('   Title:', topic.title);
    console.log('   ID:', topic.id);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedFeb1()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });