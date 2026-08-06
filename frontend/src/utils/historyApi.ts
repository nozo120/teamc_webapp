// src/utils/historyApi.ts

const API_BASE = 'http://localhost:3001'; // ※必要に応じてポート番号を変更してください

// バックエンドから返ってくる生のトランザクションデータの型（DB構造に合わせる）
type RawTransaction = {
    id: number;
    senderId: number;
    receiverId: number;
    amount: number;
    createdAt: string;
    // 相手の名前や自身の名前がバックエンドから結合されてくる場合の型定義（必要に応じて調整）
    sender?: { name: string };
    receiver?: { name: string };
};

export type TransactionHistory = {
    id: number;
    userId: number; // どのユーザーの履歴か
    name: string;   // 相手の名前
    amount: number; // 金額（senderが1ならマイナス、それ以外ならプラス）
    date: string;   // 日付
};

/**
 * すべての履歴データを取得し、指定したユーザー視点でのプラス・マイナスや相手の名前を振り分けて返す
 */
export async function getTransactionHistory(userId: number): Promise<TransactionHistory[]> {
    // 1. バックエンドから全ての履歴データを取得する（またはクエリなしで全件取得）
    const response = await fetch(`${API_BASE}/history`);
    
    if (!response.ok) {
        throw new Error('入出金履歴の取得に失敗しました');
    }

    const rawData: RawTransaction[] = await response.json();

    // 2. 自分が関係している（senderId または receiverId が userId）データだけをフィルタリング
    const userTransactions = rawData.filter(
        (tx) => tx.senderId === userId || tx.receiverId === userId
    );

    // 3. フロントエンド側でプラス・マイナスや表示データを振り分ける
    const historyList: TransactionHistory[] = userTransactions.map((tx) => {
        // senderId が 1（または指定ユーザー）のときは送金なのでマイナス
        // それ以外のときは他人から払われた（または受け取った）ものなのでプラス
        const isSender = tx.senderId === userId;
        const adjustedAmount = isSender ? -tx.amount : tx.amount;

        // 相手の名前を決定（自分が送ったなら receiver の名前、自分が受け取ったなら sender の名前）
        // ※バックエンドのデータ構造に合わせて調整してください
        const partnerName = isSender 
            ? (tx.receiver?.name ?? `ユーザーID: ${tx.receiverId}`) 
            : (tx.sender?.name ?? `ユーザーID: ${tx.senderId}`);

        // 日付のフォーマット調整（例: 2026-08-06）
        const formattedDate = tx.createdAt ? tx.createdAt.split('T')[0] : '';

        return {
            id: tx.id,
            userId: userId,
            name: partnerName,
            amount: adjustedAmount,
            date: formattedDate,
        };
    });

    // 日付の新しい順（降順）にソート
    historyList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return historyList;
}