import express from "express";
const router = express.Router();

import  registerTransfer  from "../controllers/registerTransferController";

router.post("/", registerTransfer);

module.exports = router;



