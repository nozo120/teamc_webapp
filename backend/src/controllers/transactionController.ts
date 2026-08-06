import type { Request, Response } from 'express';;
import { TransactionService } from '../services/transactionService.js';

export class TransactionController {
  /**
   * 
   * 取引履歴を取得するハンドラー
   */
  static async getTransactions(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      // 1. userId が渡されていない場合のエラーハンドリング
      if (!userId) {
        return res.status(400).json({ 
          error: 'クエリパラメーター userId が指定されていません (例: /api/transactions?userId=1)' 
        });
      }

      const userIdNum = Number(userId);

      // 2. userId が数値以外の文字（abcなど）の場合のエラーハンドリング
      if (isNaN(userIdNum)) {
        return res.status(400).json({ 
          error: 'userId は有効な数値で指定してください' 
        });
      }

      // 正常系：数値化（userIdNum）した値を Service に渡す
      const transactions = await TransactionService.getTransactions(userIdNum);
      console.log(transactions);

      return res.status(200).json(transactions);
    } catch (error) {
      console.error('取引履歴取得エラー:', error);
      return res.status(500).json({ error: '取引履歴の取得に失敗しました' });
    }
  }
}