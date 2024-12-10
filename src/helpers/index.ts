import { db } from "@/server/db";
import {
  EmailAddress,
  EmailMessage,
  SyncResponse,
  SyncUpdatedResponse,
} from "@/types/global";
import { SyncToDataBase } from "@/utils/database-sync";
import axios from "axios";

export class Account {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  // Helper to fetch email pages
  private async fetchEmailPages({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string | null;
    pageToken?: string | null;
  }): Promise<{ emails: EmailMessage[]; nextDeltaToken: string | null }> {
    try {
      let allEmails: EmailMessage[] = [];
      let nextDeltaToken = deltaToken || null;

      let response = await this.getUpdatedEmailsByBookmarkToken({
        deltaToken,
        pageToken,
      });

      allEmails = response.records;
      if (response.nextDeltaToken) {
        nextDeltaToken = response.nextDeltaToken;
      }

      while (response.nextPageToken) {
        response = await this.getUpdatedEmailsByBookmarkToken({
          pageToken: response.nextPageToken,
        });
        allEmails = allEmails.concat(response.records);

        if (response.nextDeltaToken) {
          nextDeltaToken = response.nextDeltaToken;
        }
      }

      return { emails: allEmails, nextDeltaToken };
    } catch (error) {
      console.error("Error fetching email pages:", error);
      throw new Error("Failed to fetch email pages.");
    }
  }

  // Method to initiate the sync process
  private async startSync(daysWithin: number): Promise<SyncResponse> {
    try {
      const response = await axios.post<SyncResponse>(
        "https://api.aurinko.io/v1/email/sync",
        {},
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            daysWithin,
            bodyType: "html",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error initiating sync:", error);
      throw new Error("Failed to initiate sync.");
    }
  }

  // Method to fetch updated emails by delta token or page token
  private async getUpdatedEmailsByBookmarkToken({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string | null;
    pageToken?: string | null;
  }): Promise<SyncUpdatedResponse> {
    try {
      const params: Record<string, string> = {};
      if (deltaToken) params.deltaToken = deltaToken;
      if (pageToken) params.pageToken = pageToken;

      const response = await axios.get<SyncUpdatedResponse>(
        "https://api.aurinko.io/v1/email/sync/updated",
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching updated emails:", error);
      throw new Error("Failed to fetch updated emails.");
    }
  }

  // Primary email sync function
  async primaryEmailSyncFunc() {
    try {
      let syncResponse = await this.startSync(2);
      const maxAttempts = 10;
      let attempts = 0;

      while (!syncResponse.ready && attempts < maxAttempts) {
        console.log(
          `Attempt ${attempts + 1}/${maxAttempts}: Sync not ready, retrying...`,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        syncResponse = await this.startSync(2);
        attempts++;
      }

      if (!syncResponse.ready) {
        throw new Error("Synchronization failed after multiple attempts.");
      }

      const { emails, nextDeltaToken } = await this.fetchEmailPages({
        deltaToken: syncResponse.syncUpdatedToken,
      });

      console.log(`Sync Completed: Total ${emails.length} emails fetched`);

      return { recordEmails: emails, deltaToken: nextDeltaToken };
    } catch (error) {
      console.error("Primary email sync process failed:", error);
      throw new Error("Primary email sync process failed.");
    }
  }

  // SEND EMAILS
  async sendEmails({
    bcc,
    body,
    cc,
    from,
    inReplyTo,
    references,
    replyTo,
    subject,
    to,
    threadId,
  }: {
    from: EmailAddress;
    subject: string;
    body: string;
    inReplyTo?: string;
    references?: string;
    to: EmailAddress[];
    cc?: EmailAddress[];
    bcc?: EmailAddress[];
    replyTo?: EmailAddress[];
    threadId?: string;
  }) {
    try {
      const resp = await axios.post(
        "https://api.aurinko.io/v1/email/messages",
        {
          bcc,
          body,
          cc,
          from,
          inReplyTo,
          references,
          replyTo,
          subject,
          to,
          threadId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      return resp.data;
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email.");
    }
  }

  // Method to sync new emails to the database
  async SyncNewEmailsInDb() {
    try {
      const acc = await db.account.findUnique({
        where: {
          token: this.token,
        },
      });

      if (!acc) throw new Error("Invalid token");
      if (!acc.nextDeltaToken) throw new Error("No delta token");

      const { emails, nextDeltaToken } = await this.fetchEmailPages({
        deltaToken: acc.nextDeltaToken,
      });

      if (emails.length === 0) {
        console.log("No new emails to sync.");
        return;
      }

      try {
        await SyncToDataBase(emails, acc.id);
        console.log("Emails synced to database successfully.");
      } catch (error) {
        console.error("Error syncing emails to database:", error);
        throw new Error("Failed to sync emails to the database.");
      }

      await db.account.update({
        where: { id: acc.id },
        data: { nextDeltaToken },
      });

      console.log("Account updated successfully with the new delta token.");
    } catch (error) {
      console.error("Error syncing new emails to database:", error);
    }
  }
}
