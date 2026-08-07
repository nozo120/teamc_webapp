const API_BASE = 'http://localhost:3001'; // ※必要に応じてポート番号を変更してください

export type TransactionHistory = {
    id: number;
    userId: number; // どのユーザーの履歴か
    name: string;   // 相手の名前
    amount: number; // 金額（プラスなら入金、マイナスなら出金など）
    date: string;   // 日付
};

/**
 * 指定ユーザーの入出金履歴を取得
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

    const history: TransactionHistory[] = await response.json();

    return history;
}