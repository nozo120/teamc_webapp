import type { Request, Response } from "express";
import { dealing } from "../services/remitService.js";

export const handleRemit = async (req: Request, res: Response) => {
  try {

    const { senderId, receiverId, amount, message } = req.body;

    if (senderId === undefined || receiverId === undefined || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "senderId, receiverId, amount は必須です。",
      });
    }

    const result = await dealing(
      Number(senderId),
      Number(receiverId),
      Number(amount),
      message ?? ""
    );

    return res.status(200).json({
      success: true,
      message: "送金が正常に完了しました。",
      data: result,
    });

  } catch (error: any) {
  console.error("送金エラー:", error);

  return res.status(400).json({
    success: false,
    message: error.message || "送金処理に失敗しました。",
  });

  }
};