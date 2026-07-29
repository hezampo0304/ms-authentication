/*
  Warnings:

  - The values [BUS_OPERATOR] on the enum `TenantType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `browser` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `deviceType` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `lastActivity` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `operatingSystem` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `email_verification_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `oauth_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password_reset_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'ACTIVE', 'LOCKED', 'DISABLED');

-- CreateEnum
CREATE TYPE "IdentityProvider" AS ENUM ('LOCAL', 'GOOGLE', 'MICROSOFT', 'APPLE', 'GITHUB');

-- CreateEnum
CREATE TYPE "CredentialType" AS ENUM ('PASSWORD', 'PASSKEY', 'TOTP', 'RECOVERY_CODE');

-- AlterEnum
ALTER TYPE "TenantStatus" ADD VALUE 'PENDING_APPROVAL';

-- AlterEnum
BEGIN;
CREATE TYPE "TenantType_new" AS ENUM ('TRAVEL_AGENCY', 'HOTEL', 'AIRLINE', 'TRANSPORT_COMPANY', 'TOUR_OPERATOR', 'CORPORATE');
ALTER TABLE "tenants" ALTER COLUMN "type" TYPE "TenantType_new" USING ("type"::text::"TenantType_new");
ALTER TYPE "TenantType" RENAME TO "TenantType_old";
ALTER TYPE "TenantType_new" RENAME TO "TenantType";
DROP TYPE "public"."TenantType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "email_verification_tokens" DROP CONSTRAINT "email_verification_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "oauth_accounts" DROP CONSTRAINT "oauth_accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_userId_fkey";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "browser",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "deviceType",
DROP COLUMN "lastActivity",
DROP COLUMN "operatingSystem",
DROP COLUMN "status",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastActivityAt" TIMESTAMP(3),
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerified",
DROP COLUMN "enabled",
DROP COLUMN "lastLogin",
DROP COLUMN "passwordHash",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'INVITED';

-- DropTable
DROP TABLE "email_verification_tokens";

-- DropTable
DROP TABLE "oauth_accounts";

-- DropTable
DROP TABLE "password_reset_tokens";

-- DropTable
DROP TABLE "permissions";

-- DropTable
DROP TABLE "role_permissions";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "user_roles";

-- DropEnum
DROP TYPE "OAuthProvider";

-- DropEnum
DROP TYPE "SessionStatus";

-- CreateTable
CREATE TABLE "identities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "IdentityProvider" NOT NULL,
    "identifier" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "lastAuthenticatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "type" "CredentialType" NOT NULL,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "identities_userId_idx" ON "identities"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "identities_provider_identifier_key" ON "identities"("provider", "identifier");

-- CreateIndex
CREATE INDEX "credentials_identityId_idx" ON "credentials"("identityId");

-- CreateIndex
CREATE INDEX "sessions_isActive_idx" ON "sessions"("isActive");

-- CreateIndex
CREATE INDEX "tenants_status_idx" ON "tenants"("status");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- AddForeignKey
ALTER TABLE "identities" ADD CONSTRAINT "identities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
