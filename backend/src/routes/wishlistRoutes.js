import express from 'express';
import {
  getAllPubLists,
  getListsByUserId,
  createWishlist,
  updateWishlist,
  deleteWishlist,
} from '../controllers/wishlistController.js';

const router = express.Router();

router.get('/public', getAllPubLists);
router.get('/user/:id', getListsByUserId);
router.post('/:id', createWishlist);
router.put('/:id', updateWishlist);
router.delete('/:id', deleteWishlist);

export default router;
