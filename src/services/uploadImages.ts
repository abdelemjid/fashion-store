import cloudinary from "@/lib/cloudinary";

interface UploadImageResult {
  publicId: string;
  imageUrl: string;
}

export async function uploadImages(
  images: File[],
): Promise<UploadImageResult[]> {
  if (images.length === 0 || images.length > 4) {
    throw new Error("Please upload between 1 and 4 images!");
  }

  return Promise.all(
    images.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise<UploadImageResult>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "fashion",
            transformation: [{ format: "webp" }],
          },
          (error, result) => {
            if (error || !result) {
              reject(error);
              return;
            }

            resolve({
              imageUrl: result.secure_url,
              publicId: result.public_id,
            });
          },
        );

        stream.end(buffer);
      });
    }),
  );
}
