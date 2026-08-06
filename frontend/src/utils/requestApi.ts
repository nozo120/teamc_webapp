// src/utils/requestApi.ts
// 請求（リクエスト）まわりのAPI呼び出しをまとめる
// 接続先はバックエンド。ユーザー情報を取る userApi.ts の json-server(3010) とは別のサーバー
const API_BASE = 'http://localhost:3001';

/**
 * 請求を登録するときに送るデータの形
 * バックエンドの RequestBody（requestController.ts）と合わせる
 */
export type CreateRequestParams = {
    amount: number;
    message?: string;
    requesterId: number; // 請求する人（自分）
    payerId: number;     // 支払う人（請求先）
};

/**
 * 請求を登録したときに返ってくるデータの形
 * createdAt はサーバー側では Date だが、JSONに日付型が無いため文字列で届く
 */
export type CreateRequestResult = {
    id: string;
    requesterId: number;
    payerId: number | null;
    amount: number;
    message: string | null;
    status: string;
    createdAt: string;
    requestLink: string;
};

/**
 * 請求を登録する
 * @param params 請求の内容
 * @returns 登録された請求（請求リンクを含む）
 */
export async function createRequest(params: CreateRequestParams): Promise<CreateRequestResult> {
    const response = await fetch(`${API_BASE}/request`, {
        method: 'POST',
        // これが無いとバックエンドの express.json() が本文を読めず req.body が空になる
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        throw new Error('請求の登録に失敗しました');
    }

    return response.json();
}
