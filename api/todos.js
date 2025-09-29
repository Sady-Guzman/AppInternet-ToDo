// api/todos.js
import { Pool } from "pg";

// Conexión a Neon usando variable de entorno en Vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // necesario para Neon
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    // obtener todos
    const result = await pool.query("SELECT * FROM todos ORDER BY id");
    return res.status(200).json(result.rows);
  }

  if (req.method === "POST") {
    // agregar un todo
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Falta el texto" });
    }
    const result = await pool.query(
      "INSERT INTO todos (text, status) VALUES ($1, $2) RETURNING *",
      [text, "pendiente"]
    );
    return res.status(201).json(result.rows[0]);
  }

  // método no soportado
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Método ${req.method} no permitido`);
}
