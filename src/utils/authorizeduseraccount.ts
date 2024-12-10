import { db } from "@/server/db";

export const authorizeUserAcessAccount = async (
  accountId: string,
  userId: string,
) => {
  try {
    const account = await db.account.findFirst({
      where: {
        userId,
        id: accountId,
      },
      select: {
        id: true,
        emailAddress: true,
        name: true,
        token: true,
      },
    });

    console.log(account);

    if (!account) {
      throw new Error("ACCOUNT NOT FOUND");
    }

    return account;
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
};
