import { exchangecodeforAccessToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { waitUntil } from "@vercel/functions";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (status !== "success")
    return NextResponse.json(
      { error: "Account connection failed" },
      { status: 400 },
    );

  const code = params.get("code");
  const token = await exchangecodeforAccessToken(code as string);
  if (!token)
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 400 },
    );
  const accountDetails = await getAccountDetails(token.accessToken);
  if (!accountDetails) {
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 400 },
    );
  }
  await db.account.upsert({
    where: { id: token.accountId.toString() },
    create: {
      id: token.accountId.toString(),
      userId,
      token: token.accessToken,
      provider: "Aurinko",
      emailAddress: accountDetails.email,
      name: accountDetails.name,
    },
    update: {
      token: token.accessToken,
    },
  });
  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_APP_URL}/api/aurinko/emailsync`, {
        accountId: token.accountId.toString(),
        userId,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      }),
  );

  return NextResponse.redirect(new URL("/mail-dashboard", req.url));
};
