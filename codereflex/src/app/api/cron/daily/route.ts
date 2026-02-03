import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { generateDailyTopic } from "~/server/ai/gemini";

export async function GET(req: Request) {
  // 1. Auth Guard (Requires CRON_SECRET env variable)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 2. Idempotency Check (Don't seed twice on the same day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exists = await db.topic.findFirst({
      where: {
        type: "DAILY",
        publishedAt: { gte: today }
      }
    });

    if (exists) return NextResponse.json({ message: "Daily already seeded" });

    // 3. Generate & Save
    const data = await generateDailyTopic();
    const result = await db.topic.create({
      data: {
        ...data,
        type: "DAILY",
        publishedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, id: result.id });
  } catch (e) {
    return NextResponse.json({ error: "Daily Seed Failed" }, { status: 500 });
  }
}