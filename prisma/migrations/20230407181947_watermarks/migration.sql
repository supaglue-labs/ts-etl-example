-- CreateTable
CREATE TABLE "watermarks" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "provider_name" TEXT NOT NULL,
    "common_model" TEXT NOT NULL,
    "watermark" TIMESTAMP(3),

    CONSTRAINT "watermarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "watermarks_customer_id_provider_name_common_model_key" ON "watermarks"("customer_id", "provider_name", "common_model");
