// src/actions/denuncias.js
import { db } from "../../db/index.js";
import { denunciasTable } from "../../db/schema.js";

export async function criarDenuncia({ userId, category, desc, image }) {
  try {
    const [novaDenuncia] = await db
      .insert(denunciasTable)
      .values({
        userId,
        category,
        desc,
        image,
      })
      .returning();

    return novaDenuncia;
  } catch (error) {
    console.error("Erro ao criar denúncia:", error);
    throw error;
  }
}
