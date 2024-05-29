-- CreateEnum
CREATE TYPE "Status" AS ENUM ('BLOCKED', 'PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "pickingId" UUID,
    "pickingStatus" "Status" NOT NULL DEFAULT 'BLOCKED',
    "deliveryId" UUID,
    "deliveryStatus" "Status" NOT NULL DEFAULT 'BLOCKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");
