import { Router } from 'express';
import * as likesController from '../controllers/likes.controller.js';

const likesRoutes = Router();

/**
 * ==========================================
 * 📦 RUTAS DE likes
 * ==========================================
 */
 
likesRoutes.get('/likes', likesController.getlikes);
likesRoutes.get('/count', likesController.sendCountlikes);

export default likesRoutes;


