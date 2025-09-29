import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ error: "Falta user_id" });

    const result = await pool.query(
      "SELECT * FROM todos WHERE user_id=$1 ORDER BY id",
      [userId]
    );
    return res.status(200).json(result.rows);
  }

  if (req.method === "POST") {
    try {
      const { text, user_id } = req.body;  // Ojo aquí
      if (!text || !user_id) return res.status(400).json({ error: "Falta texto o user_id" });

      const result = await pool.query(
        "INSERT INTO todos (user_id, text) VALUES ($1, $2) RETURNING *",
        [user_id, text]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Error interno" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Método ${req.method} no permitido`);
}
