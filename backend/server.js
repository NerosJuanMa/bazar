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




// Arrancar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});