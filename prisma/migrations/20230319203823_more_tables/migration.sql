/*
  Warnings:

  - You are about to drop the `ApplicationContact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CrmContact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ApplicationContact";

-- DropTable
DROP TABLE "CrmContact";

-- CreateTable
CREATE TABLE "crm_contacts" (
    "id" TEXT NOT NULL,
    "blob" JSONB NOT NULL,

    CONSTRAINT "crm_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_opportunities" (
    "id" TEXT NOT NULL,
    "blob" JSONB NOT NULL,

    CONSTRAINT "crm_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_leads" (
    "id" TEXT NOT NULL,
    "blob" JSONB NOT NULL,

    CONSTRAINT "crm_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_users" (
    "id" TEXT NOT NULL,
    "blob" JSONB NOT NULL,

    CONSTRAINT "crm_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_accounts" (
    "id" TEXT NOT NULL,
    "blob" JSONB NOT NULL,

    CONSTRAINT "crm_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_contacts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "application_contacts_pkey" PRIMARY KEY ("id")
);
