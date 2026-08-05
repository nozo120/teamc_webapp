// adapters.ts
// 他画面が持っているユーザーデータの形を、この画面が使う User 型に変換する。
// Hayashiさんの User 型（userIconURL / accountNumber）とフィールド名が違うため、
// ここで吸収してから TransferScreen に渡す。
import type { User } from "./types";

// Hayashiさんの User.ts と同じ形（型そのものはimportせず、必要なフィールドだけ指定）
type HayashiUser = {
  userIconURL: string;
  accountNumber: number;
  name: string;
};

export const toRecipient = (user: HayashiUser): User => ({
  id: String(user.accountNumber),
  name: user.name,
  imageUrl: user.userIconURL,
});
