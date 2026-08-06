// remitApi.ts
// 送金処理（json-server版）
//
// 本来この処理はバックエンド(POST /api/remit)が1回で行うべきもの。
// backend が未実装の間の代替として、json-server に対して
// 「残高を読む → 計算する → 書き戻す」を手動で行っている。
// backend が完成したら、この関数の中身を fetch("/api/remit") 1本に差し替える。

const API_BASE = "http://localhost:3010";

type RemitParams = {
  senderId: number;
  receiverId: number;
  amount: number;
  message: string;
};

// json-server の users から1件取得する
const fetchUser = async (id: number) => {
  const res = await fetch(`${API_BASE}/users/${id}`);
  if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました");
  return res.json();
};

// 請求リンクの kozaBango からユーザーを1件探す。
// リンク生成側が「口座番号(1234567)」を入れる場合と「ユーザーID(1)」を入れる場合の
// どちらもありえるので、口座番号で探して見つからなければIDとして扱う。
export const fetchUserByAccountNumber = async (accountNumber: string) => {
  const res = await fetch(`${API_BASE}/users?accountNumber=${accountNumber}`);
  if (res.ok) {
    const users = await res.json();
    if (Array.isArray(users) && users.length > 0) return users[0];
  }

  // 口座番号として見つからなかったので、ユーザーIDとして取り直す
  const byId = await fetch(`${API_BASE}/users/${accountNumber}`);
  if (!byId.ok) throw new Error("請求元のユーザーが見つかりませんでした");
  return byId.json();
};

// 残高だけを書き換える（PATCHは指定した項目だけ更新する）
const updateBalance = async (id: number, balance: number) => {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ balance }),
  });
  if (!res.ok) throw new Error("残高の更新に失敗しました");
};

export const remit = async ({ senderId, receiverId, amount, message }: RemitParams) => {
  // 1. 送金元・送金先の「今の」残高を取り直す
  //    画面表示時の値は古くなっている可能性があるため
  const [sender, receiver] = await Promise.all([
    fetchUser(senderId),
    fetchUser(receiverId),
  ]);

  // 2. 残高が足りているか最終確認（画面のチェックをすり抜けた場合の保険）
  if (sender.balance < amount) {
    throw new Error("残高が不足しています");
  }

  // 3. 双方の残高を更新する
  await updateBalance(senderId, sender.balance - amount);
  await updateBalance(receiverId, receiver.balance + amount);

  // 4. 送金履歴を記録する
  //    db.json に "transactions": [] が無いと404になるので、
  //    履歴だけは失敗しても送金自体は成立とみなす
  try {
    await fetch(`${API_BASE}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId,
        receiverId,
        amount,
        message,
        createdAt: new Date().toISOString(),
      }),
    });
  } catch {
    console.warn("送金履歴の記録に失敗しました（db.jsonにtransactionsがない可能性）");
  }
};
