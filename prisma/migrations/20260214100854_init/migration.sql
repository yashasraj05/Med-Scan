/*
  Warnings:

  - Added the required column `password` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "age" TEXT,
    "gender" TEXT,
    "city" TEXT,
    "bloodGroup" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Patient" ("age", "bloodGroup", "createdAt", "gender", "id", "name") SELECT "age", "bloodGroup", "createdAt", "gender", "id", "name" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_username_key" ON "Patient"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
