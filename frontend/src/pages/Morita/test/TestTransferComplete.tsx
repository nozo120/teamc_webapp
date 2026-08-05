// test/TestTransferComplete.tsx
import { useLocation, useNavigate } from "react-router-dom";
import type { TransferCompleteState } from "../types";

const TestTransferComplete: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as TransferCompleteState | null;

  if (!state) return <p>【テスト】データが渡っていません</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>【テスト】送金完了</h2>
      {/* 受け取った値をそのまま表示して、正しく届いたか確認する */}
      <p>送金先ID: {state.recipient.id}</p>
      <p>送金先名: {state.recipient.name}</p>
      <p>画像パス: {state.recipient.imageUrl}</p>
      <p>
        金額: {state.amount}（型: {typeof state.amount}）
      </p>
      <p>メッセージ: {state.message || "（なし）"}</p>
      <button onClick={() => navigate("/")}>最初に戻る</button>
    </div>
  );
};

export default TestTransferComplete;
