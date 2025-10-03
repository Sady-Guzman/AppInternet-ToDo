import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { text, user_id } = req.body;
      if (!text || !user_id) {
        return res.status(400).json({ error: "Falta texto o user_id" });
      }

      const result = await pool.query(
        "INSERT INTO todos (user_id, text, status) VALUES ($1, $2, 'pendiente') RETURNING *",
        [user_id, text]
      );

      return res.status(201).json(result.rows[0]);
    }

    if (req.method === "GET") {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ error: "Falta user_id" });
      }

      const result = await pool.query(
        "SELECT * FROM todos WHERE user_id = $1 ORDER BY id",
        [user_id]
      );

      return res.status(200).json(result.rows);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (err) {
    console.error("Error en /api/todos:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}