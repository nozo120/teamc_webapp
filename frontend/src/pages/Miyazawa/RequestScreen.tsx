import React, { useState, useEffect } from 'react';
// @ts-ignore
import './request.css';

export default function RequestScreen() {
  const [generatedLink, setGeneratedLink] = useState("https://example.com/pay?id=123456");
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
    // 起動したバックエンドのURLを指定
    fetch('http://localhost:3001/api/requests') // ※APIのパスは実際のルーティングに合わせて調整してください
      .then((res) => res.json())
      .then((data) => {
        setGeneratedLink(data.link);
      })
      .catch((err) => {
        console.error("通信エラー:", err);
      });
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