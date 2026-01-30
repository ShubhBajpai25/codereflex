import { TopicType } from "generated/prisma";
import { z } from "zod";
import { generateDailyTopic, generateWeeklyTopic } from "~/server/ai/gemini";
import {createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc"

export const topicRouter = createTRPCRouter({
    getLatest: publicProcedure
        .input(z.object({ type: z.nativeEnum(TopicType) }))
        .query(async ({ctx, input}) => {
            return await ctx.db.topic.findMany({
                where: { type: input.type },
                orderBy: { publishedAt: "desc" },
                take: 30, //need to fix to show either 30/31/28 based on the month 
            });
        }),
    
        toggleSave: protectedProcedure
            .input(z.object({ topicId: z.string(), shouldSave: z.boolean() }))
            .mutation(async ({ ctx, input }) => {
                return await ctx.db.user.update({
                    where: { id: ctx.session.user.id },
                    data: {
                        savedTopics: input.shouldSave
                            ? { connect: { id: input.topicId }}
                            : { disconnect: { id: input.topicId }},
                    },
                });
            }),
        
        seedDaily: protectedProcedure.mutation(async ({ctx}) => {
            const aiData = await generateDailyTopic();
            return await ctx.db.topic.create({
                data: {
                    title: aiData.title,
                    content: aiData.content,
                    miniDesc: aiData.miniDesc,
                    tags: aiData.tags,
                    image: aiData.image,
                    citations: aiData.citations,
                    type: "DAILY"
                },
            });
        }),

        seedWeekly: protectedProcedure.mutation(async ({ctx}) => {
            const aiData = await generateWeeklyTopic();
            return await ctx.db.topic.create({
                data: {
                    title: aiData.title,
                    content: aiData.content,
                    miniDesc: aiData.miniDesc,
                    tags: aiData.tags,
                    image: aiData.image,
                    citations: aiData.citations,
                    type: "WEEKLY"
                },
            });
        }),
});