// backend/src/services/transaction.service.ts
// backend/src/services/transaction.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TransactionService {
  /**
   * ログインユーザー視点に整形した入出金履歴を取得する
   */
  static async getTransactions(currentUserId: number) {
    // 1. 自分に関係する取引レコードを取得
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: currentUserId },
          { receiverId: currentUserId },
        ],
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
      orderBy: {
        createdAt: 'desc', // 新しい順
      },
    });

    // 2. 送金・入金に応じて相手の情報と符号付き金額に整形
    return transactions.map((tx) => {
      const isOutgoing = tx.senderId === currentUserId; // 自分が送金者かどうか
      const partner = isOutgoing ? tx.receiver : tx.sender; // 相手のオブジェクト

      return {
        id: tx.id,
        userId: currentUserId,
        name: partner.name,
        amount: isOutgoing ? -tx.amount : tx.amount,
        date: tx.createdAt.toISOString(),
  };
    });
  }
}