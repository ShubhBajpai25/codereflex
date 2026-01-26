import { TopicType } from "generated/prisma";
import { z } from "zod";
import {createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc"

export const topicRouter = createTRPCRouter({

    getTopic: publicProcedure
        .input(z.object({ type: z.nativeEnum(TopicType)}))
        .query(({ctx, input }) => {
        return ctx.db.topic.findFirst({
            orderBy: {publishedAt: "desc"},
            where: { type: input.type }
        });
    }),

    getTopics: publicProcedure
        .input(z.object({ type: z.nativeEnum(TopicType)}))
        .query(({ctx, input }) => {
        return ctx.db.topic.findFirst({
            orderBy: {publishedAt: "desc"},
            where: { type: input.type }
        });
    }),

    publishTopic: protectedProcedure
        .input(z.object({
            title: z.string(),
            content: z.string(),
            type: z.nativeEnum(TopicType)
        }))
        .mutation(async ({ctx, input})=> {
            const author = await ctx.db.author.findUnique({
                where: { id: ctx.session.user.id }
            });

            if (!author) {
                throw new Error("Only users registered as authors can publish topics.")
            }

            return await ctx.db.topic.create({
                data: {
                    title: input.title,
                    content: input.content,
                    type: input.type,
                    author: { connect: { id: author.id }}
                }
            })
        })   
});