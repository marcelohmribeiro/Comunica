import { settings } from "@/settings";

export const uploadToCloudinary = async (imageUri) => {
  const { CD_UPLOAD_PRESET, CD_NAME } = settings;
  try {
    const formData = new FormData();
    const allowedImages = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    formData.append("file", {
      uri: imageUri,
      type: allowedImages,
      name: "report.jpg",
    });
    formData.append("upload_preset", CD_UPLOAD_PRESET);
    formData.append("folder", "reports");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      const errText = await response.text();
      console.error("Erro Cloudinary:", errText);
      throw new Error("Falha no upload para o Cloudinary");
    }
    const data = await response.json();
    return { secure_url: data.secure_url };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
