import pool from "../config/db.js";

export async function obtenerTodos() {
    const [rows] = await pool.query(
    `SELECT id, nombre, descripcion, precio, stock, categoria, imagen_url, activo, creado_en
     FROM productos
     WHERE activo = 1
     ORDER BY nombre ASC`
  );
  return rows;
}