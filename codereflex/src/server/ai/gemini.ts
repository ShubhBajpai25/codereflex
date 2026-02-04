import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "~/env";

const genAI = new GoogleGenerativeAI(env.GOOGLE_GENERATIVE_API_KEY);

export async function generateDailyTopic() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    ### ROLE
    You are the CodeReflex AI content engine. You specialize in high-signal, low-noise technical insights for developers.

    ### TASK
    Generate a daily insight for a software engineering audience. Topic must be covered in moderate depth.
    Citations must be at the very bottom.

    Use strict Markdown. Use '###' for all sub-headers (like Phase steps). Use double-asterisks '**' only for key technical terms. Ensure there is exactly one empty line between every paragraph. Do not use generic lists; use structured paragraphs for depth.

    ### TOPIC THEMES
    Focus on: Distributed Systems, K8s, Language Internals, LeetCode (Easy/Med/Hard), Cybersecurity, or Job Market.

    ### OUTPUT SPECIFICATION
    Return ONLY a JSON object. Do not include markdown code blocks.
    {
    "title": "A punchy, 5-7 word title",
    "content": "A detailed explanation (800-1000 words). Clear, professional language.",
    "miniDesc": "A 1-sentence reflex takeaway. Max 100 characters.",
    "tags": ["3 relevant tags"],
    "category": "The type of information, i.e. Programming Language, History, Breakthrough, etc.",
    "citations": ["List of 2-3 real-world source URLs or paper titles used for this topic"],
    "imageSlug": "a hyphenated-short-description-for-image-generation"
    }

    ### NEGATIVE CONSTRAINTS
    - NO simple topics, NO emojis, NO intro filler, NO mention of AI.
    - NO code snippets longer than 10 lines.
    - NO outdated tech (jQuery, SVN).
    - NO hallucinated sources, must be real and authentic.
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  const aiData = JSON.parse(response.text().replace(/```json|```/g, ""));

  const freeImageUrl = `https://image.pollinations.ai/prompt/${aiData.imageSlug}?width=1024&height=1024&nologo=true`;

  return {
    title: aiData.title,
    content: aiData.content,
    miniDesc: aiData.miniDesc,
    category: aiData.category,
    tags: aiData.tags,
    image: freeImageUrl,
    citations: aiData.citations
  };
}

export async function generateWeeklyTopic() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    ### ROLE
    You are the CodeReflex AI content engine. You specialize in high-signal, low-noise technical insights for developers.

    ### TASK
    Generate a weekly insight (High Depth). Around 1000-1500 words.
    Citations at the bottom.

    Use strict Markdown. Use '###' for all sub-headers (like Phase steps). Use double-asterisks '**' only for key technical terms. Ensure there is exactly one empty line between every paragraph. Do not use generic lists; use structured paragraphs for depth.

    ### TOPIC THEMES
    Focus on: Distributed Systems, K8s, Language Internals, LeetCode (Med/Hard), Cybersecurity, or Job Market.

    ### OUTPUT SPECIFICATION
    Return ONLY a JSON object.
    {
    "title": "A punchy title",
    "content": "Detailed explanation (1000-1500 words).",
    "miniDesc": "1-sentence takeaway.",
    "tags": ["3 tags"],
    "category": "The type of information, i.e. Programming Language, History, Breakthrough, etc.",
    "citations": ["List of 2-3 real-world source URLs or paper titles used for this topic"],
    "imageSlug": "hyphenated-architectural-visual-description"
    }

    ### NEGATIVE CONSTRAINTS
    - NO simple topics, NO emojis, NO intro filler.
    - NO code longer than 10 lines.
    - NO hallucinated sources, must be real and authentic.
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const aiData = JSON.parse(response.text().replace(/```json|```/g, ""));

  const freeImageUrl = `https://image.pollinations.ai/prompt/${aiData.imageSlug}?width=1024&height=1024&nologo=true`;

  return {
    title: aiData.title,
    content: aiData.content,
    miniDesc: aiData.miniDesc,
    tags: aiData.tags,
    category: aiData.category,
    image: freeImageUrl,
    citations: aiData.citations
  };
}