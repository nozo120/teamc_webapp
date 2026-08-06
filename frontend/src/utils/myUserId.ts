// src/utils/myUserId.ts

let userId:number = 1;

/**
 * 使用者のIdを返す関数
 * @returns 使用者のId。未設定・不正値のときは DEFAULT_USER_ID
 */
export function getMyUserId(): number {
    return userId;
}

/**
 * 使用者のIdを切り替える
 *
 * @param id 切り替え先のユーザーID（1以上の整数）
 */
export function setMyUserId(id: number): void {
    userId = id;
}
    
