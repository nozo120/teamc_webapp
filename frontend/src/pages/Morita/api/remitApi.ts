// remitApi.ts
// 送金処理（本物のバックエンドAPI版）
const BACKEND_URL = "http://localhost:3001";

// 請求リンクの kozaBango からユーザーを1件探す用（まだjson-serverのDBを見ている）
// ※これは remit（送金の実行）とは別のデータソース。
//   ユーザー一覧・請求元検索がバックエンド(Prisma)側に統一されたら、
//   ここも同じBACKEND_URLに合わせて書き換える。
const JSON_SERVER_BASE = "http://localhost:3010";

type RemitParams = {
  senderId: number;
  receiverId: number;
  amount: number;
  message: string;
};

// 口座番号（またはユーザーID）からユーザーを1件探す。
export const fetchUserByAccountNumber = async (accountNumber: string) => {
  const res = await fetch(`${JSON_SERVER_BASE}/users?accountNumber=${accountNumber}`);
  if (res.ok) {
    const users = await res.json();
    if (Array.isArray(users) && users.length > 0) return users[0];
  }

  // 口座番号として見つからなかったので、ユーザーIDとして取り直す
  const byId = await fetch(`${JSON_SERVER_BASE}/users/${accountNumber}`);
  if (!byId.ok) throw new Error("請求元のユーザーが見つかりませんでした");
  return byId.json();
};

export const remit = async ({ senderId, receiverId, amount, message }: RemitParams) => {
  const res = await fetch(`${BACKEND_URL}/api/remit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senderId, receiverId, amount, message }),
  });

  const json = await res.json();

  if (!res.ok || json.success === false) {
    throw new Error(json.message ?? "送金に失敗しました");
  }
};
