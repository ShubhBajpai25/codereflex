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
        return ctx.db.topic.findMany({
            orderBy: {publishedAt: "desc"},
            where: { type: input.type }
        });
    }),
});