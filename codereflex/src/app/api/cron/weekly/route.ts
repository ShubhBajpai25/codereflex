import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { generateWeeklyTopic } from "~/server/ai/gemini"; // Adjust path if needed

export async function GET(req: Request) {
  // 1. Security Check
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 2. TIMEZONE FIX: Determine "Today" in Melbourne
    // If cron runs Sunday 13:00 UTC, this creates "Monday 00:00" Melbourne Time
    const melbourneTimeStr = new Date().toLocaleString("en-US", { 
        timeZone: "Australia/Melbourne" 
    });
    const targetDate = new Date(melbourneTimeStr);

    // Normalize to midnight just to be safe
    targetDate.setHours(0, 0, 0, 0);

    // 3. DUPLICATE CHECK
    // Check if we already created a WEEKLY topic in the last 3 days (Melbourne Time)
    // This prevents double-posting if the cron retries
    const threeDaysAgo = new Date(targetDate);
    threeDaysAgo.setDate(targetDate.getDate() - 3);

    const exists = await db.topic.findFirst({
      where: {
        type: "WEEKLY",
        publishedAt: { gte: threeDaysAgo }
      }
    });

    if (exists) {
      console.log("Weekly topic already exists for this week.");
      return NextResponse.json({ message: "Weekly already seeded" });
    }

    // 4. GENERATE & SAVE
    const data = await generateWeeklyTopic();
    
    const result = await db.topic.create({
      data: {
        title: data.title,
        content: data.content,
        miniDesc: data.miniDesc,
        category: data.category,
        tags: data.tags,
        image: data.image,
        citations: data.citations,
        type: "WEEKLY",
        publishedAt: targetDate, // <--- SAVED AS MONDAY (Melbourne Time)
      }
    });

    return NextResponse.json({ success: true, id: result.id, date: targetDate });

  } catch (e) {
    console.error("Weekly Seed Failed:", e);
    return NextResponse.json({ error: "Weekly Seed Failed" }, { status: 500 });
  }
}