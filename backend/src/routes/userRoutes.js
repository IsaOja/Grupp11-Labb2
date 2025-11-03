import express from "express";
import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  removeUser,
  loginUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", addUser);
router.post("/login", loginUser);
router.put("/:id", updateUser);
router.delete("/:id", removeUser);

export default router;
