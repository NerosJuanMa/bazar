import pool2 from "../config/db2.js";

export async function likedQuery() {
    const [rows] = await pool2.query(
    `SELECT id FROM likes WHERE page_id=? AND user_ip=?`
  );
  return rows;
}

export async function countQuery() {
    const [rows] = await pool2.query(
    `SELECT COUNT(*) AS total FROM likes WHERE page_id=?`
  );
  return rows;
}
 
export async function obtenerlikes() {
    const [rows] = await pool2.query(
    `SELECT * FROM likes WHERE page_id=? AND user_ip=?`
  );
  return rows;
}

export async function sendCount(liked) {
    const [rows] = pool2.query(
      'SELECT COUNT(*) AS total FROM likes WHERE page_id=?',
      [pageId],
    );
    return rows;
}
    // Quitar like
export async function delQuery(liked) {
    const [rows] = pool2.query(
      ' DELETE FROM likes WHERE page_id=? AND user_ip=?',
    );
    return rows;
}
      
    // Dar like
export async function insQuery(liked) {
    const [rows] = pool2.query(
      ' INSERT INTO likes (page_id, user_ip) VALUES (?,?)'
    );
    return rows;
}      

 