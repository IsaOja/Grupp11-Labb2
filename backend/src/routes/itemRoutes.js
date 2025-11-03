import express from 'express';
import {
  getItems,
  getItemsByUser,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';

const router = express.Router();

router.get('/wishlist/:wishlist_id', getItems);
router.get('/user/:user_id', getItemsByUser);
router.post('/:wishlist_id', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
