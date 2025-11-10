import express from "express";
import {
  getAllPubLists,
  getListsByUserId,
  createWishlist,
  updateWishlist,
  deleteWishlist,
} from "../controllers/wishlistController.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

router.get("/public", getAllPubLists);
router.get("/user/:id", getListsByUserId);
router.post("/:id", requireAuth, createWishlist);
router.post("/me", requireAuth, createWishlist);
router.put("/:id", requireAuth, updateWishlist);
router.delete("/:id", requireAuth, deleteWishlist);

export default router;
