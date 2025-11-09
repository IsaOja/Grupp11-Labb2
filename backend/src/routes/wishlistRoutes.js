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
router.post("/:id", createWishlist);
router.post("/me", requireAuth, createWishlist);
router.put("/:id", updateWishlist);
router.delete("/:id", deleteWishlist);

export default router;
