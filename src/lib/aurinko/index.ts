"use server";
import Axios from "axios";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export const getAurnikoAuthUrl = async (
  serviceType: "Google" | "Office365",
) => {
  const userId = await auth();
  if (!userId) {
    throw new Error("You are Unauthorized");
  }

  const params = new URLSearchParams({
    clientId: process.env.AURINKO_CLIENT_ID as string,
    serviceType,
    scopes: "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/aurinko/callback`,
  });

  console.log(`https://api.aurinko.io/v1/auth/authorize?${params.toString()}`);

  return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
};

export const exchangecodeforAccessToken = async (code: string) => {
  console.log("🚀 ~ exchangecodeforAccessToken ~ code:", code);
  try {
    const response = await Axios.post(
      `https://api.aurinko.io/v1/auth/token/${code}`,
      {},
      {
        auth: {
          username: process.env.AURINKO_CLIENT_ID as string,
          password: process.env.AURINKO_CLIENT_SECRET as string,
        },
      },
    );

    return response.data as {
      accountId: number;
      accessToken: string;
      userId: string;
      userSession: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    }
    console.log(error);
  }
};

export const getAccountDetails = async (accessToken: string) => {
  try {
    const response = await Axios.get("https://api.aurinko.io/v1/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data as {
      email: string;
      name: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    }
    console.log(error);
  }
};
