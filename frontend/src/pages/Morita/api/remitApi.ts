// remitApi.ts
// 送金処理（json-server / バックエンド連携版）

const API_BASE = "http://localhost:3001";

type RemitParams = {
  senderId: number;
  receiverId: number;
  amount: number;
  message?: string;
};

// json-server の users から1件取得する
const fetchUser = async (id: number) => {
  const res = await fetch(`${API_BASE}/users/${id}`);
  if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました");
  return res.json();
};

// 請求リンクの口座番号からユーザーを1件探す（IDでのフォールバック付き）
export const fetchUserByAccountNumber = async (accountNumber: string) => {
  // まず口座番号として検索を試みる
  const res = await fetch(`${API_BASE}/users?accountNumber=${accountNumber}`);
  if (res.ok) {
    const users = await res.json();
    if (Array.isArray(users) && users.length > 0) {
      return users[0];
    }
  }

  // 口座番号で見つからなかった場合、ユーザーIDとして直接取得を試す
  const byId = await fetch(`${API_BASE}/users/${accountNumber}`);
  if (!byId.ok) {
    throw new Error("請求元のユーザーが見つかりませんでした");
  }
  return byId.json();
};

// 送金処理（バックエンドの Express / Prisma トランザクションを呼び出す）
export const remit = async ({ senderId, receiverId, amount, message }: RemitParams) => {
  console.log("送金データ", {
    senderId,
    receiverId,
    amount,
    message,
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