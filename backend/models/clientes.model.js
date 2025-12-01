import pool from "../config/db.js";

export async function buscarPorEmail(email) {
    const [rows] = await pool.query(
        'SELECT id, nombre, email, password, creado_en FROM clientes WHERE email = ?', [email]);
    return rows[0]; 
};

