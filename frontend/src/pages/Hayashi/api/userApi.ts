// src/api/userApi.ts
import { user } from '../../../user';

const API_URL = 'http://localhost:3010/users';

/**
 * DB (json-server) からユーザー情報の一覧を取得する関数
 * @returns Promise<User[]> ユーザーオブジェクトの配列
 */
export async function getUsers(): Promise<user[]> {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('ユーザー情報の取得に失敗しました');
    }

    // 取得した JSON データを User のリストとして返却
    const users: user[] = await response.json();
    return users;
}