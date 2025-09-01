const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  return res.json("Bem vindo a API!");
});

app.get("/users", async (req, res) => {});

app.listen(8080, () => {
  "Servidor rodando";
});
