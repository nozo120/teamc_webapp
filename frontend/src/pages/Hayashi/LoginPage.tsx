// src/pages/Hayashi/LoginPage.tsx
// ユーザーIDを入力して「今アプリを使っている人」を切り替える画面。
// パスワードは扱わない（認証ではなく、利用者の切り替え）。
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import { setMyUserId } from '../../utils/myUserId';
import { getUser } from '../../utils/userApi';
import '../../styles/phone.css';
import './LoginPage.css';

export function LoginPage() {
    // 入力中のID。数値ではなく文字列で持つ（未入力を "" で表せるようにするため）
    const [inputId, setInputId] = useState<string>('');

    // 照合中かどうか。連打で二重に問い合わせないようにする
    const [isChecking, setIsChecking] = useState<boolean>(false);

    // 入力が不正・該当ユーザーなしのときのメッセージ
    const [loginError, setLoginError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleLogin = async () => {
        const id = Number(inputId);

        if (!Number.isInteger(id) || id <= 0) {
            setLoginError('IDは1以上の整数で入力してください');
            return;
        }

        setIsChecking(true);
        setLoginError(null);

        try {
            // 存在しないIDで進むと以降の画面が空表示になり原因が分かりにくいので、
            // DBに実在するか確かめてから切り替える
            await getUser(id);

            setMyUserId(id);
            navigate(PATHS.HOME);
        } catch {
            setLoginError('そのIDのユーザーは見つかりませんでした');
        } finally {
            setIsChecking(false);
        }
    };

    return (
        // スマホ枠を画面中央に置くための外側
        <div className='phone-container'>
            <div className='phone'>
                <h2 className='phone-title'>ログイン</h2>

                <p className='login-description'>
                    利用者のIDを入力してください
                </p>

                <label className='login-label' htmlFor='login-user-id'>ユーザーID</label>
                <input
                    id='login-user-id'
                    className='login-input'
                    type='number'
                    // スマホで数字キーボードが出るようにする
                    inputMode='numeric'
                    min={1}
                    placeholder='例) 1'
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    // 入力欄でEnterを押しても送信できるようにする
                    onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                />

                {/* 失敗したときだけ表示する */}
                {loginError && <p className='login-error'>{loginError}</p>}

                <button
                    className='login-button'
                    onClick={handleLogin}
                    disabled={inputId === '' || isChecking}
                >
                    {isChecking ? '確認中...' : 'ログイン'}
                </button>
            </div>
        </div>
    );
}
