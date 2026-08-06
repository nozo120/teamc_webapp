// remitApi.ts
// 送金処理（json-server版）
//
// 本来この処理はバックエンド(POST /api/remit)が1回で行うべきもの。
// backend が未実装の間の代替として、json-server に対して
// 「残高を読む → 計算する → 書き戻す」を手動で行っている。
// backend が完成したら、この関数の中身を fetch("/api/remit") 1本に差し替える。

const API_BASE = "http://localhost:3001";

type RemitParams = {
  senderId: number;
  receiverId: number;
  amount: number;
  message?: string;
};

// 口座番号からユーザーを1件探す（必要に応じてバックエンドのユーザー検索APIに繋ぎ替え）
export const fetchUserByAccountNumber = async (accountNumber: string) => {
  const res = await fetch(`${API_BASE}/api/users?accountNumber=${accountNumber}`);
  if (!res.ok) throw new Error("請求元の情報が取得できませんでした");
  const users = await res.json();
  if (!Array.isArray(users) || users.length === 0) {
    throw new Error("請求元のユーザーが見つかりませんでした");
  }
  return users[0];
};

// 送金処理（バックエンドの Express / Prisma トランザクションを呼び出す）
export const remit = async ({ senderId, receiverId, amount, message }: RemitParams) => {
  console.log("送金データ", {
    senderId,
    receiverId,
    amount,
  });
  const res = await fetch(`${API_BASE}/api/remit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      senderId: Number(senderId),
      receiverId: Number(receiverId),
      amount: Number(amount),
      message,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "送金処理に失敗しました");
  }

  return data;
};