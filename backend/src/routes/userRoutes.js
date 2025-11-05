import express from "express";
import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  removeUser,
  loginUser,
  me,
} from "../controllers/userController.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", addUser);
router.post("/login", loginUser);

router.get("/me", requireAuth, me);
router.get("/:id", requireAuth, getUser);
router.put("/:id", requireAuth, updateUser);
router.delete("/:id", requireAuth, removeUser);

export default router;
