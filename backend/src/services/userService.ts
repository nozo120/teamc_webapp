import { prisma } from "../utils/prisma.js";

// ユーザー全件。一覧の並びが毎回変わらないようID順に固定する
export const findAllUsers = () => prisma.user.findMany({ orderBy: { id: "asc" } });

// ID1件。見つからない場合は null が返る
export const findUserById = (id: number) => prisma.user.findUnique({ where: { id } });

// 口座番号で検索する。
// accountNumber は @unique なので結果は0件か1件だが、
// 移行前の json-server が配列を返していたため、呼び出し側を変えずに済むよう配列で返す
export const findUsersByAccountNumber = (accountNumber: string) =>
  prisma.user.findMany({ where: { accountNumber } });
