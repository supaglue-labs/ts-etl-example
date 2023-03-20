import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

// Workaround to be able to dynamically fetch the right delegate from the prisma client since it uses a getter for each model name and you can't fetch it by string.
export function getPrismaDelegate(
  tx: Omit<
    PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
  >,
  objectListName: string
):
  | Prisma.CrmContactDelegate<
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
  | Prisma.CrmLeadDelegate<
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
  | Prisma.CrmAccountDelegate<
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
  | Prisma.CrmOpportunityDelegate<
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
  | Prisma.CrmUserDelegate<
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    > {
  switch (objectListName) {
    case "contacts":
      return tx.crmContact;
    case "leads":
      return tx.crmLead;
    case "accounts":
      return tx.crmAccount;
    case "opportunities":
      return tx.crmOpportunity;
    case "users":
      return tx.crmUser;
    default:
      throw new Error("not implemented");
  }
}
