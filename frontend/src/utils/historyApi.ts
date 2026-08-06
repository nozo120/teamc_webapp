// src/utils/historyApi.ts

const API_BASE = 'http://localhost:3001';

export type TransactionHistory = {
    id: number;
    userId: number;
    name: string;
    amount: number;
    date: string;
};

/**
 * 指定したユーザーの入出金履歴を取得する
 */
export async function getTransactionHistory(
    userId: number
): Promise<TransactionHistory[]> {

    const response = await fetch(
        `${API_BASE}/history?userId=${userId}`
    );

    if (!response.ok) {
        throw new Error('入出金履歴の取得に失敗しました');
    }

    return response.json();
}