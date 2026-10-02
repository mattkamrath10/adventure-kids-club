import { handleUpload, handleUploadPresigned, type HandleUploadBody } from "@vercel/blob/client";
import { issueSignedToken } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/image-slots";

function assertSlotPath(pathname: string) {
  if (!pathname.startsWith("slots/") || pathname.includes("..")) {
    throw new Error("Not allowed");
  }
}

async function authorize(pathname: string) {
  if (!(await isOwner())) throw new Error("Not allowed");
  assertSlotPath(pathname);
}

export async function POST(request: Request) {
  let body: { type?: string };
  try {
    body = (await request.json()) as { type?: string };
  } catch {
    return NextResponse.json({ error: "Could not upload that picture." }, { status: 400 });
  }

  try {
    if (body.type === "blob.generate-presigned-url") {
      const result = await handleUploadPresigned({
        request,
        body: body as Parameters<typeof handleUploadPresigned>[0]["body"],
        getSignedToken: async (pathname) => {
          await authorize(pathname);
          const token = await issueSignedToken({
            pathname,
            operations: ["put"],
            allowedContentTypes: [...ALLOWED_IMAGE_TYPES],
            maximumSizeInBytes: MAX_IMAGE_BYTES,
          });
          return {
            token,
            urlOptions: {
              addRandomSuffix: false,
              allowedContentTypes: [...ALLOWED_IMAGE_TYPES],
              maximumSizeInBytes: MAX_IMAGE_BYTES,
            },
          };
        },
      });
      return NextResponse.json(result);
    }

    const result = await handleUpload({
      request,
      body: body as HandleUploadBody,
      onBeforeGenerateToken: async (pathname) => {
        await authorize(pathname);
        return {
          allowedContentTypes: [...ALLOWED_IMAGE_TYPES],
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: false,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const status = message === "Not allowed" ? 401 : 400;
    return NextResponse.json({ error: "Could not upload that picture." }, { status });
  }
}
