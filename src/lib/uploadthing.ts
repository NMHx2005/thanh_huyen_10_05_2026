import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { UploadThingError } from "uploadthing/server";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const uploadRouter = {
  documentPdf: f({
    pdf: { maxFileSize: "32MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id || session.user.role !== "ADMIN") {
        throw new UploadThingError("Chỉ quản trị viên mới được tải PDF lên.");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, userId: metadata.userId as string };
    }),
  documentThumbnail: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id || session.user.role !== "ADMIN") {
        throw new UploadThingError("Chỉ quản trị viên mới được tải ảnh lên.");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
