import express from 'express';
import { body } from 'express-validator';
import { register, login, logout, verifyToken } from '../controllers/auth.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  validateRequest
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validateRequest
], login);

router.post('/logout', logout);
router.get('/verify', verifyToken);

export default router;