// types.ts
// ユーザーの型は frontend/src/user.ts に一本化されている（Hayashiさんが整備）
import type { user as User } from "../../user";
export type { User };

// 顧客リスト画面 → 金額入力画面 に渡すデータ
export type TransferScreenState = {
  recipient: User;
};

// 金額入力画面 → 完了画面 に渡すデータ
export type TransferCompleteState = {
  recipient: User;
  amount: number; // 整数・円単位
  message: string;
};
