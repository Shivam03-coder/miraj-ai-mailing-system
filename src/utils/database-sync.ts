import { db } from "@/server/db";
import type {
  SyncUpdatedResponse,
  EmailMessage,
  EmailAddress,
  EmailAttachment,
  EmailHeader,
} from "@/types/global";
import pLimit from "p-limit";
import { Prisma } from "@prisma/client";
import { OramaClient } from "@/lib/orama";

// FUNCTION TO SYNC EMAILS TO THE DATABASE
export const SyncToDataBase = async (
  Allemails: EmailMessage[],
  accountId: string,
) => {
  console.log(`syncing emails has ${Allemails.length}`);
  const Limit = pLimit(10); // LIMITING CONCURRENT PROMISE EXECUTIONS TO 10
  const Orama = new OramaClient(accountId);
  await Orama.initializeOrama();

  try {
    for (const email of Allemails) {
      await Orama.insertInDb({
        title: email.subject,
        body: email.body,
        rawBody: email.bodySnippet ?? "",
        from: `${email.from.name} <${email.from.address}>`,
        to: email.to.map((t) => `${t.name} <${t.address}>`),
        sentAt: new Date(email.sentAt).toLocaleString(),
        threadId: email.threadId,
      });
      upsertEmail(email, accountId);
    }
  } catch (error) {
    console.log("error", error);
  }
};

// FUNCTION TO UPSERT A SINGLE EMAIL
const upsertEmail = async (
  email: EmailMessage,
  accountId: string,
  index?: number,
) => {
  try {
    // DETERMINE THE LABEL TYPE OF THE EMAIL
    let emailLabelType: "inbox" | "sent" | "draft" = "inbox";
    if (
      email.sysLabels.includes("inbox") ||
      email.sysLabels.includes("important")
    ) {
      emailLabelType = "inbox";
    } else if (email.sysLabels.includes("sent")) {
      emailLabelType = "sent";
    } else if (email.sysLabels.includes("draft")) {
      emailLabelType = "draft";
    }

    // UPSERT EMAIL ADDRESSES
    const addressesToUpsert = new Map();
    for (const address of [
      email.from,
      ...email.to,
      ...email.cc,
      ...email.bcc,
      ...email.replyTo,
    ]) {
      addressesToUpsert.set(address.address, address);
    }

    const upsertedAddresses: (Awaited<
      ReturnType<typeof upsertEmailAddress>
    > | null)[] = [];

    for (const address of addressesToUpsert.values()) {
      const upsertedAddress = await upsertEmailAddress(address, accountId); // UPSERT EACH EMAIL ADDRESS
      upsertedAddresses.push(upsertedAddress);
    }

    // MAP UPSERTED ADDRESSES BY THEIR EMAIL ADDRESSES
    const addressMap = new Map(
      upsertedAddresses
        .filter(Boolean)
        .map((address) => [address!.address, address]),
    );

    const fromAddress = addressMap.get(email.from.address); // RETRIEVE FROM ADDRESS
    if (!fromAddress) {
      console.log(
        `Failed to upsert from address for email ${email.bodySnippet}`,
      );
      return;
    }

    // RETRIEVE TO, CC, BCC, AND REPLY-TO ADDRESSES
    const toAddresses = email.to
      .map((addr) => addressMap.get(addr.address))
      .filter(Boolean);
    const ccAddresses = email.cc
      .map((addr) => addressMap.get(addr.address))
      .filter(Boolean);
    const bccAddresses = email.bcc
      .map((addr) => addressMap.get(addr.address))
      .filter(Boolean);
    const replyToAddresses = email.replyTo
      .map((addr) => addressMap.get(addr.address))
      .filter(Boolean);

    // UPSERT THREAD ASSOCIATED WITH THE EMAIL
    const thread = await db.thread.upsert({
      where: { id: email.threadId },
      update: {
        subject: email.subject,
        accountId,
        lastMessageDate: new Date(email.sentAt),
        done: false,
        participantIds: [
          ...new Set([
            fromAddress.id,
            ...toAddresses.map((a) => a!.id),
            ...ccAddresses.map((a) => a!.id),
            ...bccAddresses.map((a) => a!.id),
          ]),
        ],
      },
      create: {
        id: email.threadId,
        accountId,
        subject: email.subject,
        done: false,
        draftStatus: emailLabelType === "draft",
        inboxStatus: emailLabelType === "inbox",
        sentStatus: emailLabelType === "sent",
        lastMessageDate: new Date(email.sentAt),
        participantIds: [
          ...new Set([
            fromAddress.id,
            ...toAddresses.map((a) => a!.id),
            ...ccAddresses.map((a) => a!.id),
            ...bccAddresses.map((a) => a!.id),
          ]),
        ],
      },
    });

    // UPSERT EMAIL RECORD
    await db.email.upsert({
      where: { id: email.id },
      update: {
        threadId: thread.id,
        createdTime: new Date(email.createdTime),
        lastModifiedTime: new Date(),
        sentAt: new Date(email.sentAt),
        receivedAt: new Date(email.receivedAt),
        internetMessageId: email.internetMessageId,
        subject: email.subject,
        sysLabels: email.sysLabels,
        keywords: email.keywords,
        sysClassifications: email.sysClassifications,
        sensitivity: email.sensitivity,
        meetingMessageMethod: email.meetingMessageMethod,
        fromId: fromAddress.id,
        to: { set: toAddresses.map((a) => ({ id: a!.id })) },
        cc: { set: ccAddresses.map((a) => ({ id: a!.id })) },
        bcc: { set: bccAddresses.map((a) => ({ id: a!.id })) },
        replyTo: { set: replyToAddresses.map((a) => ({ id: a!.id })) },
        hasAttachments: email.hasAttachments,
        internetHeaders: email.internetHeaders as any,
        body: email.body,
        bodySnippet: email.bodySnippet,
        inReplyTo: email.inReplyTo,
        references: email.references,
        threadIndex: email.threadIndex,
        nativeProperties: email.nativeProperties as any,
        folderId: email.folderId,
        omitted: email.omitted,
        emailLabel: emailLabelType,
      },
      create: {
        id: email.id,
        emailLabel: emailLabelType,
        threadId: thread.id,
        createdTime: new Date(email.createdTime),
        lastModifiedTime: new Date(),
        sentAt: new Date(email.sentAt),
        receivedAt: new Date(email.receivedAt),
        internetMessageId: email.internetMessageId,
        subject: email.subject,
        sysLabels: email.sysLabels,
        internetHeaders: email.internetHeaders as any,
        keywords: email.keywords,
        sysClassifications: email.sysClassifications,
        sensitivity: email.sensitivity,
        meetingMessageMethod: email.meetingMessageMethod,
        fromId: fromAddress.id,
        to: { connect: toAddresses.map((a) => ({ id: a!.id })) },
        cc: { connect: ccAddresses.map((a) => ({ id: a!.id })) },
        bcc: { connect: bccAddresses.map((a) => ({ id: a!.id })) },
        replyTo: { connect: replyToAddresses.map((a) => ({ id: a!.id })) },
        hasAttachments: email.hasAttachments,
        body: email.body,
        bodySnippet: email.bodySnippet,
        inReplyTo: email.inReplyTo,
        references: email.references,
        threadIndex: email.threadIndex,
        nativeProperties: email.nativeProperties as any,
        folderId: email.folderId,
        omitted: email.omitted,
      },
    });

    // UPDATE THREAD STATUS BASED ON EMAIL LABELS
    const threadEmails = await db.email.findMany({
      where: { threadId: thread.id },
      orderBy: { receivedAt: "asc" },
    });

    let threadFolderType = "sent";
    for (const threadEmail of threadEmails) {
      if (threadEmail.emailLabel === "inbox") {
        threadFolderType = "inbox";
        break; // IF ANY EMAIL IS IN INBOX, MARK THREAD AS INBOX
      } else if (threadEmail.emailLabel === "draft") {
        threadFolderType = "draft"; // SET TO DRAFT, CONTINUE CHECKING
      }
    }
    await db.thread.update({
      where: { id: thread.id },
      data: {
        draftStatus: threadFolderType === "draft",
        inboxStatus: threadFolderType === "inbox",
        sentStatus: threadFolderType === "sent",
      },
    });

    // UPSERT EMAIL ATTACHMENTS
    for (const attachment of email.attachments) {
      await upsertAttachment(email.id, attachment);
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(`Prisma error for email ${email.id}: ${error.message}`);
    } else {
      console.log(`Unknown error for email ${email.id}: ${error}`);
    }
  }
};

// FUNCTION TO UPSERT AN EMAIL ADDRESS
const upsertEmailAddress = async (address: EmailAddress, accountId: string) => {
  try {
    const existingAddress = await db.emailAddress.findUnique({
      where: {
        accountId_address: {
          accountId: accountId,
          address: address.address ?? "",
        },
      },
    });

    if (existingAddress) {
      return await db.emailAddress.update({
        where: { id: existingAddress.id },
        data: { name: address.name, raw: address.raw },
      });
    } else {
      return await db.emailAddress.create({
        data: {
          address: address.address ?? "",
          name: address.name,
          raw: address.raw,
          accountId,
        },
      });
    }
  } catch (error) {
    console.log(`Failed to upsert email address: ${error}`);
    return null;
  }
};

// FUNCTION TO UPSERT AN EMAIL ATTACHMENT
const upsertAttachment = async (
  emailId: string,
  attachment: EmailAttachment,
) => {
  try {
    await db.emailAttachment.upsert({
      where: { id: attachment.id ?? "" },
      update: {
        name: attachment.name,
        mimeType: attachment.mimeType,
        size: attachment.size,
        inline: attachment.inline,
        contentId: attachment.contentId,
        content: attachment.content,
        contentLocation: attachment.contentLocation,
      },
      create: {
        id: attachment.id,
        emailId,
        name: attachment.name,
        mimeType: attachment.mimeType,
        size: attachment.size,
        inline: attachment.inline,
        contentId: attachment.contentId,
        content: attachment.content,
        contentLocation: attachment.contentLocation,
      },
    });
  } catch (error) {
    console.log(`Failed to upsert attachment for email ${emailId}: ${error}`);
  }
};
