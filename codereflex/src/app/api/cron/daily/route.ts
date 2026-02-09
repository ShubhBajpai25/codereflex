import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { generateDailyTopic } from "~/server/ai/gemini";

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const fact = await generateDailyTopic();

        // --- TIMEZONE FIX START ---
        // 1. Get the current time in Melbourne (e.g., "2/9/2026, 12:00:00 AM")
        const melbourneTimeStr = new Date().toLocaleString("en-US", { 
            timeZone: "Australia/Melbourne" 
        });
        
        // 2. Create a new Date object from that string. 
        // The server (UTC) will interpret "2/9/2026" as "Feb 9th 00:00 UTC".
        // This effectively "shifts" the timestamp forward to match your calendar.
        const targetDate = new Date(melbourneTimeStr);
        // --- TIMEZONE FIX END ---

        const newTopic = await db.topic.create({
            data: {
                title: fact.title,
                content: fact.content,
                miniDesc: fact.miniDesc,
                category: fact.category,
                image: fact.image,
                // Add these if your schema supports them, otherwise remove
                tags: fact.tags, 
                citations: fact.citations,
                type: "DAILY",
                publishedAt: targetDate, // <--- Use the shifted date, not new Date()
            },
        });

        return NextResponse.json({ success: true, id: newTopic.id, date: targetDate });
    } catch (error) {
        console.error("cron job failed", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}