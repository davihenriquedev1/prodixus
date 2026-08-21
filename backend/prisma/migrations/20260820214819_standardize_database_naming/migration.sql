/*
  Warnings:

  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.

*/

-- Rename tables
ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "UserSettings" RENAME TO "user_settings";
ALTER TABLE "Project" RENAME TO "projects";
ALTER TABLE "Task" RENAME TO "tasks";
ALTER TABLE "Tag" RENAME TO "tags";
ALTER TABLE "TaskTag" RENAME TO "task_tags";
ALTER TABLE "Folder" RENAME TO "folders";

-- Rename columns
ALTER TABLE "users" RENAME COLUMN "password" TO "password_hash";
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "user_settings" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "user_settings" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "projects" RENAME COLUMN "estimatedDuration" TO "estimated_duration";
ALTER TABLE "projects" RENAME COLUMN "dueAt" TO "due_at";
ALTER TABLE "projects" RENAME COLUMN "primaryColor" TO "primary_color";
ALTER TABLE "projects" RENAME COLUMN "accentColor" TO "accent_color";
ALTER TABLE "projects" RENAME COLUMN "errorColor" TO "error_color";
ALTER TABLE "projects" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "projects" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "projects" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "projects" RENAME COLUMN "folderId" TO "folder_id";

ALTER TABLE "tasks" RENAME COLUMN "estimatedDuration" TO "estimated_duration";
ALTER TABLE "tasks" RENAME COLUMN "startAt" TO "start_at";
ALTER TABLE "tasks" RENAME COLUMN "dueAt" TO "due_at";
ALTER TABLE "tasks" RENAME COLUMN "projectId" TO "project_id";
ALTER TABLE "tasks" RENAME COLUMN "parentTaskId" TO "parent_id";
ALTER TABLE "tasks" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "tasks" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "tags" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "tags" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "tags" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "task_tags" RENAME COLUMN "taskId" TO "task_id";
ALTER TABLE "task_tags" RENAME COLUMN "tagId" TO "tag_id";

ALTER TABLE "folders" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "folders" RENAME COLUMN "parentId" TO "parent_id";
ALTER TABLE "folders" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "folders" RENAME COLUMN "updatedAt" TO "updated_at";

-- Rename primary key constraints
ALTER TABLE "users"
  RENAME CONSTRAINT "User_pkey" TO "users_pkey";

ALTER TABLE "user_settings"
  RENAME CONSTRAINT "UserSettings_pkey" TO "user_settings_pkey";

ALTER TABLE "projects"
  RENAME CONSTRAINT "Project_pkey" TO "projects_pkey";

ALTER TABLE "tasks"
  RENAME CONSTRAINT "Task_pkey" TO "tasks_pkey";

ALTER TABLE "tags"
  RENAME CONSTRAINT "Tag_pkey" TO "tags_pkey";

ALTER TABLE "folders"
  RENAME CONSTRAINT "Folder_pkey" TO "folders_pkey";

-- Rename indexes
ALTER INDEX "User_email_key"
  RENAME TO "users_email_key";

ALTER INDEX "UserSettings_userId_key"
  RENAME TO "user_settings_user_id_key";

ALTER INDEX "Tag_userId_name_key"
  RENAME TO "tags_user_id_name_key";

-- Rename foreign key constraints
ALTER TABLE "user_settings"
  RENAME CONSTRAINT "UserSettings_userId_fkey"
  TO "user_settings_user_id_fkey";

ALTER TABLE "projects"
  RENAME CONSTRAINT "Project_userId_fkey"
  TO "projects_user_id_fkey";

ALTER TABLE "projects"
  RENAME CONSTRAINT "Project_folderId_fkey"
  TO "projects_folder_id_fkey";

ALTER TABLE "tasks"
  RENAME CONSTRAINT "Task_projectId_fkey"
  TO "tasks_project_id_fkey";

ALTER TABLE "tasks"
  RENAME CONSTRAINT "Task_parentTaskId_fkey"
  TO "tasks_parent_id_fkey";

ALTER TABLE "tags"
  RENAME CONSTRAINT "Tag_userId_fkey"
  TO "tags_user_id_fkey";

ALTER TABLE "task_tags"
  RENAME CONSTRAINT "TaskTag_taskId_fkey"
  TO "task_tags_task_id_fkey";

ALTER TABLE "task_tags"
  RENAME CONSTRAINT "TaskTag_tagId_fkey"
  TO "task_tags_tag_id_fkey";

ALTER TABLE "folders"
  RENAME CONSTRAINT "Folder_userId_fkey"
  TO "folders_user_id_fkey";

ALTER TABLE "folders"
  RENAME CONSTRAINT "Folder_parentId_fkey"
  TO "folders_parent_id_fkey";