import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password, action } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Falta username o password" });
    }

    if (action === "register") {
      // Registrar usuario
      try {
        const result = await pool.query(
          "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
          [username, password] // Idealmente aquí se guarda hash de password
        );
        return res.status(201).json({ user: result.rows[0] });
      } catch (err) {
        if (err.code === "23505") { // clave única violada
          return res.status(409).json({ error: "Usuario ya existe" });
        }
        return res.status(500).json({ error: "Error interno" });
      }
    }

    // Login
    if (action === "login") {
      const result = await pool.query(
        "SELECT * FROM users WHERE username=$1 AND password=$2",
        [username, password]
      );
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Usuario o contraseña incorrecta" });
      }
      return res.status(200).json({ user: result.rows[0] });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Método ${req.method} no permitido`);
}
