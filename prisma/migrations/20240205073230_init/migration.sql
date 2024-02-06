-- CreateEnum
CREATE TYPE "TaskCheckItemState" AS ENUM ('CHECKED', 'UNCHECKED');

-- CreateTable
CREATE TABLE "templateChecklist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "templateChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklistItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "taskStatus" TEXT NOT NULL,
    "ordinalNumber" INTEGER NOT NULL DEFAULT 0,
    "checklistId" INTEGER NOT NULL,

    CONSTRAINT "checklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "taskStatus" TEXT NOT NULL,
    "checklistId" INTEGER NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taskCheckItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "taskStatus" TEXT NOT NULL,
    "ordinalNumber" INTEGER NOT NULL DEFAULT 0,
    "state" "TaskCheckItemState" NOT NULL DEFAULT 'UNCHECKED',

    CONSTRAINT "taskCheckItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "checklistItem" ADD CONSTRAINT "checklistItem_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "templateChecklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "templateChecklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taskCheckItem" ADD CONSTRAINT "taskCheckItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
