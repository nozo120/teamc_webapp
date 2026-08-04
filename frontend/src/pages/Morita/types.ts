// types.ts
// この画面まわりで使うデータの形をここに集約する
// 他の画面担当者と「この形で渡す」と合意する対象

// 送金先ユーザー
export type User = {
  id: string; // ユーザーID
  name: string; // 氏名
  imageUrl: string; // アイコン画像のパス
};

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
