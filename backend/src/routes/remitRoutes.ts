import { Router } from "express";
import { handleRemit } from "../controllers/remitController.js";

const router = Router();

router.post("/", handleRemit);

export default router;
