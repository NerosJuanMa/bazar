// routes/pedidos.routes.js
import { Router } from 'express';
import * as pedidosController from '../controllers/pedidos.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const pedidoRouter = Router();

/**
 * ==========================================
 * 🛒 RUTAS DE PEDIDOS
 * ==========================================
 * NOTA: Todas las rutas requieren autenticación
 */
// 🔐 TODAS las rutas de pedidos necesitan que el usuario esté logueado
pedidoRouter.use(verificarToken);

// Crear pedido (protegido)(Finalizar compra)
pedidoRouter.post('/', verificarToken, pedidosController.crearPedido);

// Obtener mis pedidos (protegido)
pedidoRouter.get('/mis-pedidos', verificarToken, pedidosController.getMisPedidos);

export default pedidoRouter;