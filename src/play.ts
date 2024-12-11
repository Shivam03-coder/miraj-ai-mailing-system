import { create, insert, search, type AnyOrama } from "@orama/orama";
import { db } from "./server/db";

// Create the Orama instance with the defined schema
const orama = await create({
  schema: {
    subject: "string",
    body: "string",
    rawbody: "string",
    to: "string[]",
    sentAt: "string",
    threadId: "string",
  },
});

// Fetch emails from the database
const emails = await db.email.findMany({
  select: {
    subject: true,
    body: true,
    to: true,
    sentAt: true,
    threadId: true,
  },
});

// Insert the fetched emails into the Orama instance
for (const email of emails) {
  console.log(`Inserted email with subject: ${email.subject}`);
}
