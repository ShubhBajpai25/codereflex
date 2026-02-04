import { TopicType } from "generated/prisma";
import { z } from "zod";
import { generateDailyTopic, generateWeeklyTopic } from "~/server/ai/gemini";
import {createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc"

export const topicRouter = createTRPCRouter({

    getArchives: publicProcedure
        .input(z.object({ type: z.nativeEnum(TopicType) }))
        .query(async ({ctx, input}) => {
            return await ctx.db.topic.findMany({
                where: {type: input.type},
                orderBy: {publishedAt: "desc"},
                take: 100,
            });
        }),
    getLatest: publicProcedure
        .input(z.object({ type: z.nativeEnum(TopicType) }))
        .query(async ({ctx, input}) => {
            return await ctx.db.topic.findFirst({
                where: { type: input.type },
                orderBy: { publishedAt: "desc" },
            });
        }),

        getByDate: publicProcedure
            .input(z.object({date: z.date(), type: z.nativeEnum(TopicType)}))
            .query(async ({ctx, input}) => {
                const startOfDay = new Date(input.date);
                startOfDay.setUTCHours(0,0,0,0);
                const endOfDay = new Date(input.date)
                endOfDay.setUTCHours(23, 59, 59, 999)

                return await ctx.db.topic.findFirst({
                    where: {
                        type: input.type,
                        publishedAt: {
                            gte: startOfDay,
                            lte: endOfDay,
                        },
                    },
                });
            }),

        getSavedTopicIds: protectedProcedure
            .query(async ({ ctx }) => {
                const user = await ctx.db.user.findUnique({
                    where: { id: ctx.session.user.id },
                    select: { savedTopics: { select: { id: true } } },
                });
                return (user?.savedTopics ?? []).map((t) => t.id);
            }),

        getSaved: protectedProcedure
            .query(async ({ ctx }) => {
                const user = await ctx.db.user.findUnique({
                    where: { id: ctx.session.user.id },
                    select: { savedTopics: true },
                });
                const topics = user?.savedTopics ?? [];
                return topics.slice().sort(
                    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
                );
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
                    category: aiData.category,
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
                    category: aiData.category,
                    image: aiData.image,
                    citations: aiData.citations,
                    type: "WEEKLY"
                },
            });
        }),

        manualSeed: protectedProcedure
        .input(z.object({ type: z.enum(["DAILY", "WEEKLY"]) }))
        .mutation(async ({ ctx, input }) => {
        const data = input.type === "DAILY" 
            ? await generateDailyTopic() 
            : await generateWeeklyTopic();

        return await ctx.db.topic.create({
            data: {
            ...data,
            type: input.type,
            publishedAt: new Date(),
            },
        });
        }),
    });