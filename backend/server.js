// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import pool from './config/db.js';
import pool2 from './config/db2.js';
import productosRoutes from './routes/productos.routes.js';
import cursosRoutes from './routes/cursos.routes.js';
import authRoutes from './routes/auth.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import likesRoutes from './routes/likes.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
// Middleware de logging para desarrollo
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('API Node + MySQL - Bloque 3');
});

// Ruta para probar la conexión con la base de datos
app.get('/api/probar-bbdd', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS fecha');
    res.json({
      ok: true,
      mensaje: 'Conexión correcta con la base de datos',
      fecha: rows[0].fecha
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al conectar con la base de datos',
      error: error.message
    });
  }
});
// Ruta para probar la conexión con la base de datos2
app.get('/api/probarCursos', async (req, res) => {
  try {
    const [rows] = await pool2.query('SELECT NOW() AS fecha');
    res.json({
      ok: true,
      mensaje: 'Conexión correcta con la base de datos',
      fecha: rows[0].fecha
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al conectar con la base de datos',
      error: error.message
    });
  }
});


// Rutas de la API
app.use('/api/productos', productosRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes); 
app.use('/api/likes', likesRoutes); 

//******************LIKES**********************//
//Obtener estado del like
// app.get('/status', (req, res) => {
//   const pageId = req.query.page_id;
//   const userIp = req.ip;

//   const likedQuery = `
//     SELECT id FROM likes WHERE page_id=? AND user_ip=?
//   `;
//   const countQuery = `
//     SELECT COUNT(*) AS total FROM likes WHERE page_id=?
//   `;

//   pool2.query(likedQuery, [pageId, userIp], (err, likedResult) => {
//     if (err) return res.sendStatus(500);

//     const liked = likedResult.length > 0;

//     pool2.query(countQuery, [pageId], (err, countResult) => {
//       if (err) return res.sendStatus(500);

//       res.json({
//         liked,
//         total: countResult[0].total
//       });
//     });
//   });
// });

//Dar / quitar like (toggle)


app.post('/like', (req, res) => {
  const pageId = req.body.page_id;
  const userIp = req.ip;

  const checkQuery = `
    SELECT id FROM likes WHERE page_id=? AND user_ip=?
  `;

  pool2.query(checkQuery, [pageId, userIp], (err, result) => {
    if (err) return res.sendStatus(500);

    if (result.length > 0) {
      // Quitar like
      const delQuery = `
        DELETE FROM likes WHERE page_id=? AND user_ip=?
      `;
      pool2.query(delQuery, [pageId, userIp], () => {
        sendCount(false);
      });
    } else {
      // Dar like
      const insQuery = `
        INSERT INTO likes (page_id, user_ip) VALUES (?,?)
      `;
      pool2.query(insQuery, [pageId, userIp], () => {
        sendCount(true);
      });
    }
  });

  function sendCount(liked) {
    pool2.query(
      'SELECT COUNT(*) AS total FROM likes WHERE page_id=?',
      [pageId],
      (err, result) => {
        if (err) return res.sendStatus(500);
        res.json({ liked, total: result[0].total });
      }
    );
  }
});


// Arrancar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});