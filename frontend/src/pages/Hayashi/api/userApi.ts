// src/api/userApi.ts
import { User } from '../User';

const API_URL = 'http://localhost:3000/users';

/**
 * DB (json-server) からユーザー情報の一覧を取得する関数
 * @returns Promise<User[]> ユーザーオブジェクトの配列
 */
export async function getUsers(): Promise<User[]> {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('ユーザー情報の取得に失敗しました');
    }

    // 取得した JSON データを User のリストとして返却
    const users: User[] = await response.json();
    return users;
}