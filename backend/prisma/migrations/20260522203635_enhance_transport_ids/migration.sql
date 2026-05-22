-- AlterTable (Add with default values to handle existing data)
ALTER TABLE "Driver" ADD COLUMN "driverId" TEXT NOT NULL DEFAULT 'DR-TEMP';
ALTER TABLE "Driver" ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Unknown Driver';

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN "vehicleId" TEXT NOT NULL DEFAULT 'VH-TEMP';

-- CreateIndex
CREATE UNIQUE INDEX "Driver_driverId_key" ON "Driver"("driverId");
CREATE UNIQUE INDEX "Vehicle_vehicleId_key" ON "Vehicle"("vehicleId");
