import { Router } from 'express';
import {
  getStatus,
  toggleLike
} from '../controllers/likes.controller.js';

const router = Router();

router.get('/status', getStatus);
router.post('/toggle', toggleLike);

export default router;

