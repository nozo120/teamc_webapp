import express from "express";
import { getUsers, getUserById } from "../controllers/userController.js";

const router = express.Router();

// "/" は index.ts の app.use("/users", ...) と合わさって GET /users になる
router.get("/", getUsers);
router.get("/:id", getUserById);

export default router;
