// PaymentScreen.tsx
// 請求リンクから開かれる「支払い」画面
//
// リンクの形式（請求リンク作成側が生成する）:
//   /payment/?time=2026-8-5-15-27-39-435&kozaBango=1000000&kingaku=6&message=飲み会代
//   time      … 請求が作られた日時
//   kozaBango … 請求した人の口座番号
//   kingaku   … 請求金額
//   message   … 請求メッセージ（任意。未入力だと "undefined" が入ってくることがある）
//
// ※将来の変更予定
//   金額をURLに直接載せる形は、リンクを書き換えれば請求額を改ざんできてしまう。
//   バックエンドが請求データをDBに保存できるようになったら、
//   /payment/{請求ID} の形にして、金額・請求者はIDを元にサーバーから取得する。
//   その場合に直すのは、この下の「リンクから請求内容を取り出す」ブロックだけ。
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { User } from "./types";
import { remit, fetchUserByAccountNumber } from "./api/remitApi";
import { PATHS } from "../../routes/paths";
import Toast from "./Toast";
import "./TransferScreen.css";

type Props = {
  maxAmount: number; // 支払い上限額（自分の所持金）
  senderId: number;  // 支払う人＝ログイン中の自分
};

// "2026-08-05-07-25-19-646" を「2026年8月5日 07:25:19」に整える
// （ゼロ埋めあり・なしのどちらで来ても表示できるように数値へ直してから組み立てる）
const formatLinkTime = (raw: string | null) => {
  if (!raw) return "";
  const [y, mo, d, h, mi, s] = raw.split("-");
  if (!y || !mo || !d) return raw;
  const pad = (v?: string) => String(Number(v ?? 0)).padStart(2, "0");
  return `${Number(y)}年${Number(mo)}月${Number(d)}日 ${pad(h)}:${pad(mi)}:${pad(s)}`;
};

const PaymentScreen: React.FC<Props> = ({ maxAmount, senderId }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // リンクから請求内容を取り出す
  const accountNumber = searchParams.get("kozaBango"); // 請求した人（受け取る側）
  const payerIdParam = searchParams.get("payerId");    // 請求された人（支払う側）
  const amount = parseInt(searchParams.get("kingaku") ?? "", 10);
  const rawMessage = searchParams.get("message");
  // 未入力のとき文字列の "undefined" が入ってくるので、空メッセージとして扱う
  const message = !rawMessage || rawMessage === "undefined" ? "" : rawMessage;
  const requestedAt = formatLinkTime(searchParams.get("time"));

  // 実際に支払う人。リンクに payerId があればそれを優先する。
  // ログイン機能が無く senderId は固定値なので、リンクの指定が無いときだけ props を使う
  const payerId = payerIdParam ? Number(payerIdParam) : senderId;

  // 請求した人の情報（口座番号からDBを引く）
  const [requester, setRequester] = useState<User | null>(null);
  // 支払う人の残高（リンクの payerId が自分と違う場合、propsの残高は使えないので取り直す）
  const [payerBalance, setPayerBalance] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountNumber) {
      setLoadError("リンクに請求元の情報が含まれていません");
      return;
    }
    fetchUserByAccountNumber(accountNumber)
      // DBは userIconURL、画面側は imageUrl という名前なのでここで揃える
      .then((dbUser) =>
        setRequester({
          id: String(dbUser.id),
          name: dbUser.name,
          imageUrl: dbUser.userIconURL,
        })
      )
      .catch((err) => setLoadError(err.message));
  }, [accountNumber]);

  useEffect(() => {
    // 支払う人が自分自身ならpropsの残高をそのまま使う
    if (payerId === senderId) {
      setPayerBalance(maxAmount);
      return;
    }
    fetchUserByAccountNumber(String(payerId))
      .then((dbUser) => setPayerBalance(dbUser.balance))
      .catch(() => setLoadError("支払い元のユーザーが見つかりませんでした"));
  }, [payerId, senderId, maxAmount]);

  // 金額が読み取れない＝リンクが壊れている
  const isInvalidLink = isNaN(amount) || amount <= 0;
  // 請求元と支払い元が同じリンクは成立しない（バックエンドでもエラーになる）
  const isSamePerson = requester !== null && Number(requester.id) === payerId;
  // 残高が足りているか（残高を取得できるまでは判定しない）
  const isOverLimit = !isInvalidLink && payerBalance !== null && amount > payerBalance;
  const canSubmit =
    !isInvalidLink &&
    !isOverLimit &&
    !isSamePerson &&
    requester !== null &&
    payerBalance !== null &&
    !isSubmitting;

  const handlePay = async () => {
    if (!canSubmit || !requester) return;

    const confirmed = window.confirm(`${amount.toLocaleString()}円を支払います。よろしいですか？`);
    if (!confirmed) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await remit({
        senderId: payerId,
        receiverId: Number(requester.id),
        amount,
        message,
      });

      navigate(PATHS.COMPLETE, {
        state: { recipient: requester, amount, message, kind: "payment" },
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "支払いに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // リンク自体がおかしい場合は入力画面を出さない
  if (isInvalidLink || loadError) {
    return (
      <div className="container">
        <div className="phone-frame">
          <div className="phone-scroll full-page">
            <p>{loadError ?? "請求リンクが正しくありません"}</p>
            <button className="submit-button" onClick={() => navigate(PATHS.HOME)}>
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="phone-frame">
      <div className="phone-scroll full-page">
        {/* 戻るボタン：ホーム画面に戻る */}
        <button className="back-button" onClick={() => navigate(PATHS.HOME)}>
          ← 戻る
        </button>

        {/* 請求元と請求金額。読み込みが終わったら（requester確定後）ふわっと現れる */}
        <div className={isOverLimit ? "amount-hero over-limit" : "amount-hero"}>
          {requester ? (
            <div className="hero-recipient hero-recipient-in">
              <div className="hero-avatar">
                <img src={requester.imageUrl} alt={requester.name} />
              </div>
              <span className="hero-recipient-name">{requester.name} さんへの支払い</span>
            </div>
          ) : (
            // 請求元をまだ取得中：アバターと名前の形をしたグレーのブロックを光らせる
            <div className="hero-recipient">
              <div className="hero-avatar skeleton" />
              <span className="skeleton skeleton-text" />
            </div>
          )}

          <div className="hero-amount">
            {/* 請求金額は変更できないので入力欄ではなく表示のみ */}
            <span className="hero-amount-fixed">{amount.toLocaleString()}</span>
            <span className="hero-yen">円</span>
          </div>
        </div>

        {isOverLimit && <p className="error-text">※残高が不足しています</p>}
        {isSamePerson && (
          <p className="error-text">※請求元と支払い元が同じため、支払えません</p>
        )}

        <div className="balance-row">
          <span>支払い後の残高</span>
          <span className="balance-value">
            {payerBalance === null
              ? "確認中..."
              : isOverLimit
                ? "残高不足"
                : `${(payerBalance - amount).toLocaleString()}円`}
          </span>
        </div>

        {/* 請求メッセージ（あれば） */}
        {message && (
          <>
            <p className="section-label">メッセージ</p>
            <p className="payment-message">{message}</p>
          </>
        )}

        {requestedAt && <p className="payment-time">請求日時 {requestedAt}</p>}

        <button
          className={canSubmit ? "submit-button" : "submit-button disabled"}
          onClick={handlePay}
          disabled={!canSubmit}
        >
          {isSubmitting ? <span className="button-spinner" /> : "支払う"}
        </button>
      </div>
      {submitError && <Toast message={submitError} onClose={() => setSubmitError(null)} />}
      </div>
    </div>
  );
};

export default PaymentScreen;
