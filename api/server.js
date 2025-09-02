import express from "express";
const app = express();
import cors from "cors";
import { db } from "./src/db/index.js";
import { usersTable } from "./src/db/schema.js";
import "dotenv/config";
import { criarDenuncia } from "./src/actions/criar-denuncia/index.js";

app.use(
  cors({
    origin: process.env.API_URL,
  })
);
app.use(express.json());

app.get("/", async (req, res) => {
  return res.json("Bem vindo a API!");
});

app.get("/users", async (req, res) => {
  try {
    const users = await db.select().from(usersTable);
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao buscar usúarios" });
  }
});

app.post("/denuncias", async (req, res) => {
  try {
    const { userId, category, desc, image } = req.body;

    if (!userId || !category || !desc) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    const denuncia = await criarDenuncia({ userId, category, desc, image });

    return res.status(201).json(denuncia);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar denúncia" });
  }
});

app.listen(8080, () => {
  console.log(`Servidor rodando: ${process.env.API_URL}`);
});
