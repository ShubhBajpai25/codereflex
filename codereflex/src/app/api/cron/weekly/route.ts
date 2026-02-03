import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { generateWeeklyTopic } from "~/server/ai/gemini";

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Check if we already have a weekly topic for this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);

    const exists = await db.topic.findFirst({
      where: {
        type: "WEEKLY",
        publishedAt: { gte: weekAgo }
      }
    });

    if (exists) return NextResponse.json({ message: "Weekly already seeded" });

    const data = await generateWeeklyTopic();
    const result = await db.topic.create({
      data: {
        ...data,
        type: "WEEKLY",
        publishedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, id: result.id });
  } catch (e) {
    return NextResponse.json({ error: "Weekly Seed Failed" }, { status: 500 });
  }
}