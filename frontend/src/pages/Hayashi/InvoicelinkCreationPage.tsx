// src/pages/Hayashi/InvoicelinkCreationPage.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { InputNumCard } from './inputs/InputNumCard';
import { InputTextCard } from './inputs/InputTextCard';
import { createRequest } from '../../utils/requestApi';
import { getMyUserId } from '../../utils/myUserId';
import { PATHS } from '../../routes/paths';
import '../../styles/phone.css';
import './InvoicelinkCreationPage.css';

/**
 * 遷移元（顧客リスト）から navigate の state で渡してもらうデータの形
 * 渡す側と受け取る側でこの形を合わせる
 */
export type InvoiceCreationState = {
    recipientId: number;
};

export function InvoicelinkCreationPage() {
    // InputNumCard から受け取った請求金額
    const [amount, setAmount] = useState<number>(0);

    // InputTextCard から受け取ったメッセージ
    const [message, setMessage] = useState<string>("");

    // 遷移元から渡されたデータを取り出す。型は自分で書く必要がある
    // 画面には出さず、請求リンクを作成するときに使う
    const location = useLocation();
    const state = location.state as InvoiceCreationState | null;

    // 登録に成功したら完了画面へ移動するために使う
    const navigate = useNavigate();

    // TODO: 遷移元ができたら `const { recipientId } = location.state as InvoiceCreationState;` に戻す
    // URL直打ち・リロードだと state が null になり画面が落ちるため、動作確認用に仮のIDを使う
    const recipientId = state?.recipientId ?? 1;

    // 送信中かどうか。連打で二重登録されるのを防ぐ
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // 送信に失敗したときのメッセージ。成功時・未送信時は null
    const [submitError, setSubmitError] = useState<string | null>(null);

    // 金額が入っていないうちは押せないようにする
    const canSubmit = amount > 0 && !isSubmitting;

    // 「作成」ボタンを押したとき
    const handleSubmit = async () => {
        if (!canSubmit) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const created = await createRequest({
                amount,
                message,
                requesterId: getMyUserId(), // 請求する人（自分）
                payerId: recipientId,       // 支払う人（請求先）
            });
            // 返ってきた請求をそのまま完了画面へ渡す
            // replace: true で、完了画面から戻るボタンを押しても入力画面に戻らない（＝二重登録を防ぐ）
            navigate(PATHS.INVOICE_COMPLETE, { state: created, replace: true });
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : '請求の登録に失敗しました');
        } finally {
            // 成功・失敗どちらでもボタンを押せる状態に戻す
            setIsSubmitting(false);
        }
    };

    return (
        // スマホ枠を画面中央に置くための外側
        <div className='phone-container'>
            <div className='phone'>
                {/* 1つ前の画面（請求先の選択）に戻る。送信中は押せないようにする */}
                <button
                    className='phone-back-button'
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                >
                    ← 戻る
                </button>
                <h2 className='phone-title'>請求リンクを作成</h2>

                <p className='invoice-label'>請求金額</p>
                {/* 入力が変わるたびに onAmountChanged が呼ばれ、amount が更新される */}
                <InputNumCard onAmountChanged={(value) => setAmount(value)} />

                <p className='invoice-label'>メッセージ</p>
                {/* 入力が変わるたびに onTextChanged が呼ばれ、message が更新される */}
                <InputTextCard onTextChanged={(value) => setMessage(value)} />

                {/* 送信に失敗したときだけ表示する */}
                {submitError && <p className='invoice-error'>{submitError}</p>}

                <button
                    className='invoice-submit-button'
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                >
                    {isSubmitting ? '作成中...' : '請求リンクを作成'}
                </button>

                {/* 入力内容の確認 */}
                <div className='invoice-summary'>
                    <div className='invoice-summary-row'>
                        <span className='invoice-summary-label'>請求先ID</span>
                        <span className='invoice-summary-value'>{recipientId}</span>
                    </div>
                    <div className='invoice-summary-row'>
                        <span className='invoice-summary-label'>金額</span>
                        <span className='invoice-summary-value is-amount'>
                            {amount.toLocaleString()} 円
                        </span>
                    </div>
                    <div className='invoice-summary-row'>
                        <span className='invoice-summary-label'>メッセージ</span>
                        <span className={message ? 'invoice-summary-value' : 'invoice-summary-value is-empty'}>
                            {message || '未入力'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
