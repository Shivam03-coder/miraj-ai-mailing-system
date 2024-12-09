import { db } from "@/server/db";
import { create, insert, search, type AnyOrama } from "@orama/orama";
import { persist, restore } from "@orama/plugin-data-persistence";

export class OramaClient {
  // STORES THE ORAMA INSTANCE, INITIALIZED AS NULL
  private Orama: AnyOrama | null = null;

  // STORES THE ACCOUNT ID FOR WHICH THIS CLIENT IS RESPONSIBLE
  private accountId: string;

  // CONSTRUCTOR TO INITIALIZE THE CLIENT WITH A SPECIFIC ACCOUNT ID
  constructor(accountId: string) {
    this.accountId = accountId;
  }

  // METHOD TO SAVE THE ORAMA INDEX TO THE DATABASE
  private async saveOrama() {
    // ENSURE THE ORAMA INSTANCE IS INITIALIZED BEFORE SAVING
    if (!this.Orama) {
      throw new Error("ORAMA INSTANCE IS NOT INITIALIZED.");
    }

    // PERSIST THE ORAMA INDEX AS JSON
    const index = await persist(this.Orama, "json");

    // UPDATE THE DATABASE WITH THE SAVED INDEX
    await db.account.update({
      where: {
        id: this.accountId,
      },
      data: {
        oramaIndex: index,
      },
    });
  }

  // METHOD TO INITIALIZE OR RESTORE THE ORAMA INSTANCE
  async initializeOrama() {
    // FETCH THE ACCOUNT DETAILS FROM THE DATABASE
    const account = await db.account.findUnique({
      where: {
        id: this.accountId,
      },
    });

    // THROW AN ERROR IF THE ACCOUNT IS NOT FOUND
    if (!account) {
      throw new Error("ACCOUNT NOT FOUND");
    }

    // IF AN ORAMA INDEX EXISTS, RESTORE IT FROM THE DATABASE
    if (account.oramaIndex) {
      this.Orama = await restore("json", account.oramaIndex as string);
    } else {
      // OTHERWISE, CREATE A NEW ORAMA INSTANCE WITH THE SCHEMA
      this.Orama = await create({
        schema: {
          subject: "string",
          body: "string",
          rawBody: "string",
          from: "string",
          to: "string[]",
          sentAt: "string",
          threadId: "string",
        },
      });
    }

    // SAVE THE INITIALIZED OR RESTORED ORAMA INSTANCE TO THE DATABASE
    await this.saveOrama();

    // FETCH EXISTING EMAILS FROM THE DATABASE (OPTIONAL USAGE NOT IMPLEMENTED YET)
    const emails = await db.email.findMany({
      select: {
        subject: true,
        body: true,
        from: true,
        to: true,
        sentAt: true,
        threadId: true,
      },
    });

    // INSERT THE EMAILS INTO ORAMA IF NECESSARY (CODE NOT INCLUDED)
  }

  // METHOD TO SEARCH THE ORAMA INDEX WITH A SPECIFIC TERM
  async searchInDb({ term }: { term: string }) {
    // ENSURE THE ORAMA INSTANCE IS INITIALIZED BEFORE SEARCHING
    if (!this.Orama) {
      throw new Error("ORAMA INSTANCE IS NOT INITIALIZED.");
    }

    // PERFORM THE SEARCH AND RETURN RESULTS
    return await search(this.Orama, {
      term: term,
    });
  }

  // METHOD TO INSERT DOCUMENTS INTO THE ORAMA INDEX
  async insertInDb(docs: any) {
    // ENSURE THE ORAMA INSTANCE IS INITIALIZED BEFORE INSERTING
    if (!this.Orama) {
      throw new Error("ORAMA INSTANCE IS NOT INITIALIZED.");
    }

    // INSERT THE DOCUMENTS INTO THE ORAMA INDEX
    await insert(this.Orama, docs);

    // SAVE THE UPDATED ORAMA INDEX TO THE DATABASE
    await this.saveOrama();
  }
}
