// TransferScreen.tsx
import { useState } from "react";//入力中のあたいをほじするもの
import { useNavigate, useLocation } from "react-router-dom";//別の画面に遷移するための関数取得、前画面から受け取るやつ
import type { TransferScreenState } from "./types";
import { remit } from "./api/remitApi";
import { PATHS } from "../../routes/paths";
import "./TransferScreen.css";

type Props = {
  maxAmount: number; // 送金上限額（自分の所持金）
  senderId: number;  // 送金元ユーザーID（ログイン中の自分）
};

const TransferScreen: React.FC<Props> = ({ maxAmount, senderId }) => {
  const navigate = useNavigate();

  // -----------------------------------------------------------
  // 前の画面（顧客リスト）から渡されたデータを取り出す
  // -----------------------------------------------------------
  const location = useLocation();
  const state = location.state as TransferScreenState | null;

  // -----------------------------------------------------------
  // 入力欄の状態
  // hooksはif文より前に置く（Reactのルール上、順番が変わると壊れる）
  // -----------------------------------------------------------
  const [amountText, setAmountText] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // -----------------------------------------------------------
  // ガード：直接URLを打たれた/リロードされた場合はstateが空になる
  // -----------------------------------------------------------
  if (!state || !state.recipient) {
    return (
      <div className="container">
        <div className="phone-frame full-page">
          <p>送金先が選択されていません</p>
          <button onClick={() => navigate("/")}>送金先を選び直す</button>
        </div>
      </div>
    );
  }

  const recipient = state.recipient;

  // -----------------------------------------------------------
  // 入力文字列を整数に変換（10進数として読む）
  // 金額は必ず整数。小数だと計算誤差で1円合わなくなる
  // -----------------------------------------------------------
  const amount = parseInt(amountText, 10);

  // 上限額を超えているか
  const isOverLimit = !isNaN(amount) && amount > maxAmount;

  // 送金ボタンを押せる条件
  const canSubmit = !isNaN(amount) && amount > 0 && !isOverLimit;

  // 数字以外の文字を除去してから保存する
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
    setAmountText(onlyNumbers);
  };

  // 送金ボタンを押したとき
  const handleSubmit = async () => {
    if (!canSubmit) return;

    // 送信前の最終確認
    const confirmed = window.confirm(`${amount.toLocaleString()}円を送金します。よろしいですか？`);
    if (!confirmed) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await remit({
        senderId,
        receiverId: Number(recipient.id),
        amount,
        message,
      });

      navigate(PATHS.COMPLETE, {
        state: { recipient, amount, message },
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "送金に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
    <div className="phone-frame full-page">
      {/* 戻るボタン：1つ前の画面（顧客リスト）に戻る */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ← 戻る
      </button>

      {/* 送金先（前の画面から受け取った名前とアイコン） */}
      <p className="section-label">送金先</p>
      <div className="recipient-area">
        <div className="recipient-avatar">
          <img src={recipient.imageUrl} alt={recipient.name} />
        </div>
        <span className="recipient-name">{recipient.name}</span>
      </div>

      {/* 送金上限額（＝所持金） */}
      <p className="section-label">送金上限額</p>
      <p className="max-amount-text">{maxAmount.toLocaleString()}円</p>

      {/* 金額入力 */}
      <p className="section-label">送金金額</p>
      <div className={isOverLimit ? "input-with-unit over-limit" : "input-with-unit"}>
        <input
          type="text"
          inputMode="numeric"
          placeholder="金額"
          value={amountText}
          onChange={handleAmountChange}
          className="amount-input"
        />
        <span className="unit">円</span>
      </div>
      {isOverLimit && (
        <p className="error-text">※上限金額を超えています</p>
      )}

      {/* メッセージ（任意） */}
      <p className="section-label">メッセージ（任意）</p>
      <input
        type="text"
        placeholder="メッセージ"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="message-input"
      />

      {submitError && <p className="error-text">{submitError}</p>}

      {/* 送金ボタン */}
      <button
        className={canSubmit && !isSubmitting ? "submit-button" : "submit-button disabled"}
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? "送金中..." : "送金"}
      </button>
    </div>
    </div>
  );
};

export default TransferScreen;
