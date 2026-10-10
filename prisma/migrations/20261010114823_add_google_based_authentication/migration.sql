-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'CREDENTIAL');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'DELETED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" "AuthProvider" NOT NULL DEFAULT 'CREDENTIAL',
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "imagePublicId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "needPasswordChange" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "password" DROP NOT NULL;
