import express from "express";
import { TransactionController } from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", TransactionController.getTransactions);

export default router;
