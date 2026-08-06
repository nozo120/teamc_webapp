import React, { useState, useEffect } from 'react';
// @ts-ignore
import './request.css';
import { createRequest } from '../utils/requestApi';

export default function RequestScreen() {
  const [generatedLink, setGeneratedLink] = useState("読み込み中...");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackToTop = () => {
    alert("トップ画面に戻るボタンが押されました");
  };

  useEffect(() => {
    // バックエンドへ請求データを送信し、発行されたリンクを取得する
    const fetchRequestLink = async () => {
      try {
        // ※必要に応じて金額やユーザーIDを変更・あるいはprops等から受け取るようにしてください
        const result = await createRequest({
          amount: 1000,
          requesterId: 1,
          payerId: 2,
          message: '請求のテストメッセージ',
        });
        
        // バックエンドから返ってきた result.requestLink をセットする
        setGeneratedLink(result.requestLink);
      } catch (err) {
        console.error("通信エラー:", err);
        setGeneratedLink("請求リンクの取得に失敗しました");
      }
    };
    fetchRequestLink();
  }, []);

  return (
    <div className="request-container">
      <div className="request-phone-frame">
        <div className="request-message-area">
          <p className="request-main-text">請求リンクが作成されました!</p>
          <p className="request-sub-text">{generatedLink}</p>
        </div>

        <div className="request-button-group">
          <button onClick={handleCopy} className="request-btn request-btn-green">
            {copied ? 'コピーしました！' : 'リンクをコピー'}
          </button>

          <button onClick={handleBackToTop} className="request-btn request-btn-white">
            トップ画面に戻る
          </button>
        </div>
      </div>
    </div>
  );
}