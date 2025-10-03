import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { user_id } = req.query;
      if (!user_id) return res.status(400).json({ error: "Falta user_id" });

      const result = await sql`
        SELECT * FROM todos WHERE user_id = ${user_id} ORDER BY id
      `;
      return res.status(200).json(result.rows);
    }

    if (req.method === "POST") {
      // 👇 parse body safely
      let body = {};
      try {
        body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      } catch (e) {
        return res.status(400).json({ error: "Invalid JSON" });
      }

      const { text, user_id } = body;
      if (!text || !user_id) {
        return res.status(400).json({ error: "Falta texto o user_id" });
      }

      const result = await sql`
        INSERT INTO todos (user_id, text, status)
        VALUES (${user_id}, ${text}, 'pendiente')
        RETURNING *;
      `;
      return res.status(201).json(result.rows[0]);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno" });
  }
}