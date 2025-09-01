const { Client } = require("pg");
require("dotenv/config");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Conectado.");
  } catch (error) {
    console.log("Erro ao conectar", error);
    process.exit(1);
  }
};

connectDB();
