// routes/productos.routes.js
import { Router } from 'express';
import * as productosController from '../controllers/productos.cotrollers.js';

const productosRoutes = Router();
/**
 * ==========================================
 * 📦 RUTAS DE PRODUCTOS
 * ==========================================
 */
 
// Obtener todos los productos
productosRoutes.get('/', productosController.getProductos);

// GET /api/productos
// productosRoutes.get('/', (req, res) => {
//   res.json({
//     ok: true,
//     mensaje: 'Aquí devolveremos la lista de productos desde la base de datos'
//   });
// });

export default productosRoutes;


