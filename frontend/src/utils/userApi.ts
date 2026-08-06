// src/utils/userApi.ts
import { user } from '../user';

// 接続先はバックエンド(3001)。requestApi.ts と同じサーバー
// 以前は json-server(3010) が db.json を返していたが、実DB(Supabase)に移行した
const API_URL = 'http://localhost:3001/users';

/**
 * DB からユーザー情報の一覧を取得する関数
 * @returns Promise<User[]> ユーザーオブジェクトの配列
 */
export async function getUsers(): Promise<user[]> {
    const response = await fetch(API_URL);
    console.log(response);
    if (!response.ok) {
        throw new Error('ユーザー情報の取得に失敗しました');
    }

    // 取得した JSON データを User のリストとして返却
    const users: user[] = await response.json();
    return users;
}

/**
 * DB から特定のユーザー1件を取得する関数
 * 残高(balance)は変動するので、表示・上限判定の直前に毎回取り直す
 * @param id 取得したいユーザーのID
 * @returns Promise<user> ユーザーオブジェクト
 */
export async function getUser(id: number): Promise<user> {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error('ユーザー情報の取得に失敗しました');
    }

    const data: user = await response.json();
    return data;
}