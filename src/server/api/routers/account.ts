import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { authorizeUserAcessAccount } from "@/utils/authorizeduseraccount";
import { Prisma } from "@prisma/client";
import { threadId } from "worker_threads";
import { string, tuple, z } from "zod";

export const mailsRouter = createTRPCRouter({
  getAccounts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.account.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      select: {
        id: true,
        emailAddress: true,
        name: true,
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

  getThreads: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.string(),
        done: z.boolean(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await authorizeUserAcessAccount(input.accountId, ctx.auth.userId);

      // DYNAMIC CUSTOME QUERRYING

      let filter: Prisma.ThreadWhereInput = {};

      if (input.tab === "inbox") {
        filter.inboxStatus = true;
      } else if (input.tab === "draft") {
        filter.draftStatus = true;
      } else if (input.tab === "sent") {
        filter.sentStatus = true;
      }

      filter.done = {
        equals: input.done,
      };

      return await ctx.db.thread.findMany({
        where: filter,
        include: {
          emails: {
            orderBy: {
              sentAt: "asc",
            },
            select: {
              from: true,
              body: true,
              bodySnippet: true,
              emailLabel: true,
              subject: true,
              sysLabels: true,
              id: true,
              sentAt: true,
            },
          },
        },
        take: 12,
        orderBy: {
          lastMessageDate: "desc",
        },
      });
    }),

  getSuggestionEmails: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const acc = await authorizeUserAcessAccount(
        input.accountId,
        ctx.auth.userId,
      );

      return await ctx.db.emailAddress.findMany({
        where: {
          accountId: acc?.id,
        },

        select: {
          address: true,
          name: true,
        },
      });
    }),
  getEmailReplyDetails: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        threadId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const acc = await authorizeUserAcessAccount(
        input.accountId,
        ctx.auth.userId,
      );

      const thread = await ctx.db.thread.findUnique({
        where: { id: input.threadId },
        include: {
          emails: {
            orderBy: {
              sentAt: "asc",
            },
            select: {
              from: true,
              to: true,
              body: true,
              subject: true,
              bodySnippet: true,
              emailLabel: true,
              sysLabels: true,
              id: true,
              sentAt: true,
              cc: true,
              internetMessageId: true,
            },
          },
        },
      });

      if (!thread) {
        throw new Error("Thread not found");
      }

      const lastExternalEmail = thread.emails
        .reverse()
        .find((email) => email.from.id !== acc?.id);

      if (!lastExternalEmail) {
        throw new Error("No External Emails Found");
      }

      return {
        subject: lastExternalEmail.subject,
        to: [
          lastExternalEmail.from,
          ...lastExternalEmail.to.filter(
            (to) => to.address === acc?.emailAddress,
          ),
        ],
        cc: lastExternalEmail.cc.filter(
          (cc) => cc.address !== acc?.emailAddress,
        ),

        from: {
          name: acc?.name,
          address: acc?.emailAddress,
        },

        id: lastExternalEmail.internetMessageId,
      };
    }),
});
