import React, { useState } from 'react';
// @ts-ignore
import './request.css';

export default function RequestScreen() {
  const generatedLink = "https://example.com/pay?id=123456";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackToTop = () => {
    alert("トップ画面に戻るボタンが押されました");
  };

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