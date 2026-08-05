// src/pages/Hayashi/InvoicelinkCreationPage.tsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { InputNumCard } from './inputs/InputNumCard';
import { InputTextCard } from './inputs/InputTextCard';
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

    // TODO: 遷移元ができたら `const { recipientId } = location.state as InvoiceCreationState;` に戻す
    // URL直打ち・リロードだと state が null になり画面が落ちるため、動作確認用に仮のIDを使う
    const recipientId = state?.recipientId ?? 1;

    return (
        // スマホ枠を画面中央に置くための外側
        <div className='phone-container'>
            <div className='phone'>
                <h2 className='phone-title'>請求リンクを作成</h2>

                <p className='invoice-label'>請求金額</p>
                {/* 入力が変わるたびに onAmountChanged が呼ばれ、amount が更新される */}
                <InputNumCard onAmountChanged={(value) => setAmount(value)} />

                <p className='invoice-label'>メッセージ</p>
                {/* 入力が変わるたびに onTextChanged が呼ばれ、message が更新される */}
                <InputTextCard onTextChanged={(value) => setMessage(value)} />

                {/* 受け取れているか確認するための仮表示 */}
                <p className='invoice-preview'>請求先ID: {recipientId}</p>
                <p className='invoice-preview'>入力中の金額: {amount}円</p>
                <p className='invoice-preview'>入力中のメッセージ: {message}</p>
            </div>
        </div>
    );
}
