import { Router } from 'express';
import * as cursosController from '../controllers/cursos.controller.js';


const cursosRoutes = Router();

/**
 * ==========================================
 * 📦 RUTAS DE CURSOS
 * ==========================================
 */
 


cursosRoutes.get('/', cursosController.getCursos);

// GET /api/productos
// productosRoutes.get('/', (req, res) => {
//   res.json({
//     ok: true,
//     mensaje: 'Aquí devolveremos la lista de productos desde la base de datos'
//   });
// });

export default cursosRoutes;


