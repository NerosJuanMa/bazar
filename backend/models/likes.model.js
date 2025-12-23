import pool2 from '../config/db2.js';

export async function isLiked(pageId, userIp) {
  const [rows] = await pool2.query(
    'SELECT id FROM likes WHERE page_id=? AND user_ip=?',
    [pageId, userIp]
  );
  return rows.length > 0;
}

export async function countLikes(pageId) {
  const [rows] = await pool2.query(
    'SELECT COUNT(*) AS total FROM likes WHERE page_id=?',
    [pageId]
  );
  return rows[0].total;
}

export async function addLike(pageId, userIp) {
  await pool2.query(
    'INSERT INTO likes (page_id, user_ip) VALUES (?,?)',
    [pageId, userIp]
  );
}

export async function removeLike(pageId, userIp) {
  await pool2.query(
    'DELETE FROM likes WHERE page_id=? AND user_ip=?',
    [pageId, userIp]
  );
}
