import express from "express";
import { registerRequest } from "../controllers/requestController.js";


const router = express.Router();


router.post("/", registerRequest);


export default router;