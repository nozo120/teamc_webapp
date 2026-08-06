// TransferScreen.tsx
import { useRef, useState } from "react";//入力中のあたいをほじするもの
import { useNavigate, useLocation } from "react-router-dom";//別の画面に遷移するための関数取得、前画面から受け取るやつ
import type { TransferScreenState } from "./types";
import { getIconUrl } from "./types";
import { remit } from "./api/remitApi";
import { PATHS } from "../../routes/paths";
import Toast from "./Toast";
import "./TransferScreen.css";

// メッセージ欄に入力できる最大文字数
const MESSAGE_MAX_LENGTH = 100;

type Props = {
  maxAmount: number; // 送金上限額（自分の所持金）
  senderId: number;  // 送金元ユーザーID（ログイン中の自分）
};

// 電卓で使う演算子
type Operator = "+" | "-" | "×" | "÷";

// 消費税率
const TAX_RATE = 0.1;

// よく使う金額（タップで加算する）
const QUICK_AMOUNTS = [1000, 3000, 5000, 10000];

// この金額を超えたら、桁の打ち間違いを疑って再入力を求める
const HIGH_AMOUNT_THRESHOLD = 100000;

// 金額は必ず0以上の整数にそろえる（小数は1円のズレになるので切り捨て）
const toYen = (value: number) => Math.max(0, Math.floor(value));

// 2つの数を演算子どおりに計算する
const calculate = (a: number, b: number, op: Operator): number => {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? a : a / b; // 0除算は計算せず元の値のまま
  }
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
  // 電卓：確定済みの値と、押された演算子を覚えておく
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<Operator | null>(null);
  // 金額入力欄そのものへの参照（ボタンを押しても入力欄にカーソルを戻すため）
  const amountInputRef = useRef<HTMLInputElement>(null);

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

  // 画面に出す用の3桁区切り表示（12345 → 12,345）
  const displayAmount = isNaN(amount) ? "" : amount.toLocaleString();

  // 上限額を超えているか
  const isOverLimit = !isNaN(amount) && amount > maxAmount;

  // 送金したあとに残る金額（使いすぎの判断材料として出す）
  const balanceAfter = isNaN(amount) ? maxAmount : maxAmount - amount;

  // 送金ボタンを押せる条件
  // 計算の途中（例：5000 × と押しただけ）では送金させない
  const canSubmit = !isNaN(amount) && amount > 0 && !isOverLimit && pendingOp === null;

  // 数字以外の文字を除去してから保存する
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
    setAmountText(onlyNumbers);
  };

  // クイック金額ボタン：今の金額に足していく（連打で 1000 → 2000 → 3000）
  const handleQuickAmount = (value: number) => {
    const base = isNaN(amount) ? 0 : amount;
    setAmountText(String(base + value));
  };

  // 演算子（＋−×÷）を押したとき
  // 直前に計算待ちがあれば先に確定させてから、新しい演算子を覚える
  const handleOperator = (op: Operator) => {
    if (isNaN(amount)) {
      // 数字がまだ入っていない場合は、演算子の押し間違いとみなして差し替えるだけ
      if (pendingValue !== null) setPendingOp(op);
      return;
    }
    if (pendingValue !== null && pendingOp !== null) {
      setPendingValue(toYen(calculate(pendingValue, amount, pendingOp)));
    } else {
      setPendingValue(amount);
    }
    setPendingOp(op);
    setAmountText(""); // 次の数字を受け付けるため入力欄を空にする
  };

  // ＝を押したとき：計算結果を入力欄に入れて、計算待ちを解除する
  const handleEquals = () => {
    if (pendingValue === null || pendingOp === null || isNaN(amount)) return;
    setAmountText(String(toYen(calculate(pendingValue, amount, pendingOp))));
    setPendingValue(null);
    setPendingOp(null);
  };

  // 税込ボタン：今表示している金額に消費税を上乗せする
  const handleTax = () => {
    if (isNaN(amount)) return;
    setAmountText(String(toYen(amount * (1 + TAX_RATE))));
  };

  // Cボタン：入力と計算待ちを全部リセットする
  const handleClear = () => {
    setAmountText("");
    setPendingValue(null);
    setPendingOp(null);
  };

  // 入力欄でキーを押したとき：＋ − * / = Enter Esc を電卓の操作として扱う
  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // キーボードの記号と、画面上の演算子の対応表
    const opKeys: Record<string, Operator> = {
      "+": "+",
      "-": "-",
      "*": "×",
      "x": "×",
      "/": "÷",
    };

    const op = opKeys[e.key];
    if (op) {
      e.preventDefault(); // 記号そのものが入力欄に入らないようにする
      handleOperator(op);
      return;
    }
    if (e.key === "=" || e.key === "Enter") {
      e.preventDefault();
      handleEquals();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleClear();
    }
  };

  // 電卓ボタンを押しても入力欄からカーソルが外れないようにする
  const keepFocus = (e: React.MouseEvent) => e.preventDefault();

  // 送金ボタンを押したとき
  const handleSubmit = async () => {
    if (!canSubmit) return;

    // 送信前の最終確認（送金先の名前も出して、相手違いを防ぐ）
    const confirmed = window.confirm(
      `${recipient.name} さんに ${amount.toLocaleString()}円を送金します。よろしいですか？`
    );
    if (!confirmed) return;

    // 高額のときは桁の打ち間違いを疑って、金額をもう一度入力してもらう
    if (amount >= HIGH_AMOUNT_THRESHOLD) {
      const typed = window.prompt(
        `高額の送金です。確認のため、送金金額をもう一度半角数字で入力してください。\n（例：${amount}）`
      );
      if (typed === null) return; // キャンセル
      if (parseInt(typed.replace(/[^0-9]/g, ""), 10) !== amount) {
        setSubmitError("入力された金額が一致しませんでした。送金を中止しました。");
        return;
      }
    }

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

      {/* 送金先と金額をまとめたメイン表示 */}
      <div className={isOverLimit ? "amount-hero over-limit" : "amount-hero"}>
        <div className="hero-recipient">
          <div className="hero-avatar">
            <img src={getIconUrl(recipient)} alt={recipient.name} />
          </div>
          <span className="hero-recipient-name">{recipient.name} さんに送る</span>
        </div>

        <div className="hero-amount">
          {/* 計算の途中経過（例：3 ×）を金額の左にそのまま並べる */}
          {pendingValue !== null && pendingOp !== null && (
            <span className="hero-pending">{pendingValue.toLocaleString()} {pendingOp}</span>
          )}
          <input
            ref={amountInputRef}
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={displayAmount}
            onChange={handleAmountChange}
            onKeyDown={handleAmountKeyDown}
            autoFocus
            className="hero-amount-input"
            // 入力した桁数ぶんだけ幅を広げて、常に「円」が数字の右隣に来るようにする
            style={{ width: `${Math.max(1, displayAmount.length)}ch` }}
          />
          <span className="hero-yen">円</span>
        </div>
      </div>

      {isOverLimit && (
        <p className="error-text">※上限金額を超えています</p>
      )}

      {/* 送金上限額（＝所持金）と、送金後にいくら残るか */}
      <div className="balance-row">
        <span>送金上限額</span>
        <span className="balance-value">{maxAmount.toLocaleString()}円</span>
      </div>
      <div className="balance-row">
        <span>送金後の残高</span>
        <span className={isOverLimit ? "balance-value short" : "balance-value"}>
          {isOverLimit ? "残高不足" : `${balanceAfter.toLocaleString()}円`}
        </span>
      </div>

      {/* よく使う金額（タップで加算） */}
      <div className="quick-amounts" onMouseDown={keepFocus}>
        {QUICK_AMOUNTS.map((value) => (
          <button
            key={value}
            type="button"
            className="quick-amount-button"
            onClick={() => handleQuickAmount(value)}
          >
            +{value.toLocaleString()}
          </button>
        ))}
      </div>

      {/* 電卓：四則演算と税込計算 */}
      <div className="calc-pad" onMouseDown={keepFocus}>
        <button type="button" className="calc-button" onClick={() => handleOperator("+")}>＋</button>
        <button type="button" className="calc-button" onClick={() => handleOperator("-")}>−</button>
        <button type="button" className="calc-button" onClick={() => handleOperator("×")}>×</button>
        <button type="button" className="calc-button" onClick={() => handleOperator("÷")}>÷</button>
        <button type="button" className="calc-button equals" onClick={handleEquals}>＝</button>
        <button type="button" className="calc-button tax" onClick={handleTax}>税込</button>
        <button type="button" className="calc-button clear" onClick={handleClear}>C</button>
      </div>
      {pendingOp !== null && (
        <p className="calc-hint">※計算中です。＝を押して金額を確定してください</p>
      )}

      {/* メッセージ（任意） */}
      <div className="message-header">
        <p className="section-label">メッセージ（任意）</p>
        <span className="message-count">{message.length}/{MESSAGE_MAX_LENGTH}</span>
      </div>
      <input
        type="text"
        placeholder="メッセージ"
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX_LENGTH))}
        maxLength={MESSAGE_MAX_LENGTH}
        className="message-input"
      />

      {/* 送金ボタン */}
      <button
        className={canSubmit && !isSubmitting ? "submit-button" : "submit-button disabled"}
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? <span className="button-spinner" /> : "送金"}
      </button>

      {submitError && <Toast message={submitError} onClose={() => setSubmitError(null)} />}
    </div>
    </div>
  );
};

export default TransferScreen;
