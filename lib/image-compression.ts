export async function compressImage(
  file: File,
  maxWidth: number = 1600,
  quality: number = 0.8
): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");

    const scale = Math.min(1, maxWidth / bitmap.width);
    canvas.width = bitmap.width * scale;
    canvas.height = bitmap.height * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get 2D canvas context");
    }

    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    // Convert to WebP
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error("Error converting canvas to blob"));
          }
        },
        "image/webp",
        quality
      );
    });

    const fileName = file.name.replace(/\.[^.]+$/, ".webp");
    return new File([blob], fileName, { type: "image/webp" });
  } catch (error) {
    console.error("Error compressing image:", error);
    return file;
  }
}

export async function compressImages(
  files: File[],
  maxWidth: number = 1600,
  quality: number = 0.8
): Promise<File[]> {
  return Promise.all(
    files.map((file) => compressImage(file, maxWidth, quality))
  );
}

export const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function validateImageFile(file: File): boolean {
  return ALLOWED_IMAGE_MIME.has(file.type);
}

export function validateImageFiles(files: File[]): { valid: boolean; invalidFiles: string[] } {
  const invalidFiles: string[] = [];

  for (const file of files) {
    if (!validateImageFile(file)) {
      invalidFiles.push(file.name);
    }
  }

  return {
    valid: invalidFiles.length === 0,
    invalidFiles,
  };
}
