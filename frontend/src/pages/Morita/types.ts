// types.ts
// この画面まわりで使うデータの形をここに集約する
// 他の画面担当者と「この形で渡す」と合意する対象

// 送金先ユーザー
export type User = {
  id: string; // ユーザーID
  name: string; // 氏名
  imageUrl: string; // アイコン画像のパス
  // 顧客リスト画面はDBの値をそのまま渡してくるため、
  // アイコンが userIconURL という名前で入ってくることがある
  userIconURL?: string;
};

// どちらの名前で入ってきてもアイコンのパスを取り出せるようにする
export const getIconUrl = (user: User) => user.imageUrl ?? user.userIconURL ?? "";

// 顧客リスト画面 → 金額入力画面 に渡すデータ
export type TransferScreenState = {
  recipient: User;
};

// 金額入力画面 → 完了画面 に渡すデータ
export type TransferCompleteState = {
  recipient: User;
  amount: number; // 整数・円単位
  message: string;
  // 完了画面の文言を出し分ける。省略時は送金あつかい
  kind?: "transfer" | "payment";
  // 操作した本人（送金した人／支払った人）のID。
  // ホームに戻るとき ?me= を引き継いで、同じ人の画面に戻すために使う
  viewerId?: number;
};
