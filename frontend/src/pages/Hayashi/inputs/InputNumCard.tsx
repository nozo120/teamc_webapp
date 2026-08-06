import React, { useState } from 'react';
import "./InputNumCard.css"

type Props = {
    onAmountChanged: (value: number) => void
}

/**
 * 数値専用の入力欄
 * @param param0 
 * @returns 
 */
export const InputNumCard: React.FC<Props> = ({ onAmountChanged }) => {
    //入力欄に数値以外が入力されているかを管理する状態
    const [isError, setIsError] = useState<boolean>(false);

    // className には CSS セレクタではなくクラス名だけを書く（先頭の . は不要）
    // エラー中は error クラスを足して赤枠にする
    let inputClassName = isError ? "input-number error" : "input-number"

    return (
        <div>
            <input className={inputClassName} onChange={(e) => {
                // 入力欄から取れるのは文字列
                const text = e.target.value;

                // 空欄は Number("") が 0 になってしまうので、数値変換より先に判定する
                // 未入力＝入力途中なのでエラー扱いにはせず、金額は 0 に戻す
                if (text === "") {
                    setIsError(false);
                    onAmountChanged(0);
                    return;
                }

                const num = Number(text);

                // Number('abc') など変換失敗時は NaN になるため isNaN で判定する
                if (isNaN(num)) {
                    setIsError(true);
                } else {
                    setIsError(false);
                    onAmountChanged(num);
                }
            }}></input>

            {/* isError が true のときだけエラーメッセージを表示する */}
            {isError && <p className="error-message">数値を入力してください</p>}
        </div>
    );
}