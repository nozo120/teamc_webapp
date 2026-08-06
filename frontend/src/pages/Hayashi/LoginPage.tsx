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

    const canSubmit = inputId !== '' && !isChecking;

    return (
        // スマホ枠を画面中央に置くための外側
        <div className='phone-container'>
            <div className='phone login-phone'>

                {/* ブランド表示。ss.tsx のトップバーと色味を揃えている */}
                <div className='login-brand'>
                    <div className='login-logo'>口座</div>
                    <p className='login-app-title'>スマート決済アプリ</p>
                </div>

                <div className='login-form'>
                    <h2 className='login-heading'>ログイン</h2>
                    <p className='login-description'>利用者のIDを入力してください</p>

                    <label className='login-label' htmlFor='login-user-id'>
                        ユーザーID
                    </label>

                    {/* 入力欄。エラー時は枠を赤くして、どこが問題か分かるようにする */}
                    <div className={loginError ? 'login-field has-error' : 'login-field'}>
                        <span className='login-field-icon'>#</span>
                        <input
                            id='login-user-id'
                            className='login-input'
                            type='number'
                            // スマホで数字キーボードが出るようにする
                            inputMode='numeric'
                            min={1}
                            placeholder='例) 1'
                            value={inputId}
                            onChange={(e) => {
                                setInputId(e.target.value);
                                // 打ち直し始めた時点で前回のエラーは消す
                                if (loginError) setLoginError(null);
                            }}
                            // 入力欄でEnterを押しても送信できるようにする
                            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                        />
                    </div>

                    {/* 失敗したときだけ表示する。高さを常に確保して、出た瞬間に下がずれないようにする */}
                    <p className='login-error' role='alert'>
                        {loginError ?? ' '}
                    </p>

                    <button
                        className='login-button'
                        onClick={handleLogin}
                        disabled={!canSubmit}
                    >
                        {isChecking
                            ? <span className='login-spinner' aria-label='確認中' />
                            : 'ログイン'}
                    </button>
                </div>

                <p className='login-note'>パスワードの入力は不要です</p>
            </div>
        </div>
    );
}
