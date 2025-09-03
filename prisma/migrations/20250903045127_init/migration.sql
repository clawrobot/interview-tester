-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Score" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attemptId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "rationale" TEXT,
    "rubric" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Score_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Score_attemptId_key" ON "Score"("attemptId");
