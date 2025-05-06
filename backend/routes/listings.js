import express from 'express';
import { body } from 'express-validator';
import { 
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  searchListings
} from '../controllers/listings.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getListings);
router.get('/search', searchListings);
router.get('/:id', getListing);

router.post('/', [
  authenticate,
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('price').isNumeric(),
  body('location').trim().notEmpty(),
  validateRequest
], createListing);

router.put('/:id', [
  authenticate,
  body('title').trim().optional(),
  body('description').trim().optional(),
  body('price').isNumeric().optional(),
  validateRequest
], updateListing);

router.delete('/:id', authenticate, deleteListing);

export default router;