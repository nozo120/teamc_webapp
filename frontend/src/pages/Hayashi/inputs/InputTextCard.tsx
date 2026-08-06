import React from 'react';
import "./InputTextCard.css"

type Props = {
    onTextChanged: (value: string) => void
}

/**
 * テキスト用の入力欄
 * @param param0
 * @returns
 */
export const InputTextCard: React.FC<Props> = ({ onTextChanged }) => {
    return (
        <div>
            <input className="input-text" onChange={(e) => {
                // 入力欄から取れるのは文字列なので、そのまま親に渡せる
                onTextChanged(e.target.value);
            }}></input>
        </div>
    );
}
