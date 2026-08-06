import type { Request, Response } from "express";
import { createRequestLink } from "../services/requestService.js";

interface RequestBody {
  amount: number;
  message?: string;
  requesterId: number;
  payerId: number;
}

export const registerRequest = async (
  req: Request<{}, {}, RequestBody>,
  res: Response
) => {

  const {
    amount,
    message,
    requesterId,
    payerId
  } = req.body;


  const requestLink = await createRequestLink(
    amount,
    message,
    requesterId,
    payerId
  );


  res.json(requestLink);
};