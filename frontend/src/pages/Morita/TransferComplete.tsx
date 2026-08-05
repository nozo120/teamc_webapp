// TransferComplete.tsx
// 送金完了画面（本番用）
import { useLocation, useNavigate } from "react-router-dom";
import type { TransferCompleteState } from "./types";
import { PATHS } from "../../routes/paths";
import "./TransferScreen.css";
import "./TransferComplete.css";

const TransferComplete: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as TransferCompleteState | null;

  // ガード：直接URLを打たれた/リロードされた場合はstateが空になる
  if (!state || !state.recipient) {
    return (
      <div className="container">
        <div className="phone-frame full-page">
          <p>送金情報が見つかりません</p>
          <button onClick={() => navigate(PATHS.HOME)}>ホームに戻る</button>
        </div>
      </div>
    );
  }

  const { recipient: user, amount, message } = state;

  return (
    <div className="container">
      <div className="phone-frame full-page">
        <div className="complete-icon">✓</div>
        <p className="complete-title">送金が完了しました</p>

        <p className="section-label">送金先</p>
        <div className="recipient-area">
          <div className="recipient-avatar">
            <img src={user.imageUrl} alt={user.name} />
          </div>
          <span className="recipient-name">{user.name}</span>
        </div>

        <p className="section-label">送金金額</p>
        <p className="complete-amount">{amount.toLocaleString()}円</p>

        {message && (
          <>
            <p className="section-label">メッセージ</p>
            <p className="complete-message">{message}</p>
          </>
        )}

        <button className="submit-button" onClick={() => navigate(PATHS.HOME)}>
          ホームに戻る
        </button>
      </div>
    </div>
  );
};

export default TransferComplete;
