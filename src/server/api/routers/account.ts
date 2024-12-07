import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { authorizeUserAcessAccount } from "@/utils/authorizeduseraccount";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const mailsRouter = createTRPCRouter({
  getAccounts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.account.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      select: {
        id: true,
        emailAddress: true,
      },
    });
  }),

  getEmailtypesNumber: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authorizeUserAcessAccount(
        input.accountId,
        ctx.auth.userId,
      );

      let filter: Prisma.ThreadWhereInput = {};

      if (input.tab === "inbox") {
        filter.inboxStatus = true;
      } else if (input.tab === "sent") {
        filter.sentStatus = true;
      } else if (input.tab === "draft") {
        filter.draftStatus = true;
      }

      return await ctx.db.thread.count({
        where: {
          accountId: account?.id,
          ...filter,
        },
      });
    }),
});
