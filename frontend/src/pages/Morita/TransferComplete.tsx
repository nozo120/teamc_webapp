// TransferComplete.tsx
// 送金完了画面（本番用）
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { TransferCompleteState } from "./types";
import { getIconUrl } from "./types";
import { PATHS } from "../../routes/paths";
import "./TransferScreen.css";
import "./TransferComplete.css";

// 2026年8月5日 13:45:07 の形に整える
const formatDateTime = (date: Date) =>
  `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ` +
  [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");

const TransferComplete: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as TransferCompleteState | null;

  // 完了日時。この画面を開いた時刻で固定する（再描画のたびに変わらないよう関数で初期化）
  const [completedAt] = useState(() => new Date());

  // ガード：直接URLを打たれた/リロードされた場合はstateが空になる
  if (!state || !state.recipient) {
    return (
      <div className="container">
        <div className="phone-frame">
          <div className="phone-scroll full-page">
            <p>送金情報が見つかりません</p>
            <button onClick={() => navigate(PATHS.HOME)}>ホームに戻る</button>
          </div>
        </div>
      </div>
    );
  }

  const { recipient: user, amount, message, kind, viewerId } = state;

  // 請求リンクからの支払いか、通常の送金かで文言だけ変える
  const isPayment = kind === "payment";
  const title = isPayment ? "支払いが完了しました" : "送金が完了しました";
  const amountLabel = isPayment ? "支払額" : "送金額";

  // ログイン機能が無く ?me= で操作者を切り替えているため、
  // ホームに戻るときも同じ人の画面になるよう引き継ぐ
  const homePath = viewerId ? `${PATHS.HOME}?me=${viewerId}` : PATHS.HOME;

  return (
    <div className="container">
      <div className="phone-frame">
      <div className="phone-scroll complete-page">
        <div className="complete-avatar-wrap">
          <div className="complete-avatar">
            <img src={getIconUrl(user)} alt={user.name} />
          </div>
          <div className="complete-check">✓</div>
        </div>
        <p className="complete-to">{user.name} さんに</p>

        <h2 className="complete-title">{title}</h2>

        <div className="complete-amount-box">
          <p className="complete-amount-label">{amountLabel}</p>
          <p className="complete-amount">
            {amount.toLocaleString()}
            <span className="complete-yen">円</span>
          </p>
        </div>

        {message && <p className="complete-message">{message}</p>}

        <p className="complete-datetime">完了日時 {formatDateTime(completedAt)}</p>

        <button className="submit-button" onClick={() => navigate(homePath)}>
          ホームに戻る
        </button>
      </div>
      </div>
    </div>
  );
};

export default TransferComplete;
