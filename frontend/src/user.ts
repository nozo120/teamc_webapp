/**
 * DBのデータを扱いやすいようにまとめたもの
 * バックエンドの Prisma スキーマ（backend/prisma/schema.prisma の model User）と型を合わせている
 */
export type user = {
    id:number;
    userIconURL:string | null; // スキーマ上は String? なので null がありうる
    accountNumber:string;
    name:string;
    balance:number;
}
