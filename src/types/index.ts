import type { Category, Document, User } from "@prisma/client";

export type DocumentWithRelations = Document & {
  category: Category | null;
  uploadedBy: Pick<User, "id" | "name" | "email"> | null;
};

export type CategoryPublic = Pick<
  Category,
  "id" | "name" | "slug" | "icon" | "color"
>;

/** Môn / mảng kiến thức (khớp tiểu học & form tài liệu). */
export const SUBJECT_OPTIONS = [
  "Toán học",
  "Tiếng Việt",
  "Tiếng Anh",
  "Tự nhiên và Xã hội",
  "Khoa học",
  "Đạo đức",
  "Hoạt động trải nghiệm",
  "Khác",
] as const;

export type SubjectOption = (typeof SUBJECT_OPTIONS)[number];
