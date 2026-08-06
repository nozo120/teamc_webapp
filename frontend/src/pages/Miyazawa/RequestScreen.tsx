import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import { CreateRequestResult } from '../../utils/requestApi';
// @ts-ignore
import './request.css';

export default function RequestScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  // 前の画面（InvoicelinkCreationPage）から state で渡されたデータを受け取る
  const createdData = location.state as CreateRequestResult | null;

  // リンクがない場合（URLの直打ちなど）のフォールバック
  const generatedLink = createdData?.requestLink ?? "リンクが見つかりません";
  
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackToTop = () => {
    // ホーム画面（ssの画面 / PATHS.HOME）へ遷移する
    navigate(PATHS.HOME);
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