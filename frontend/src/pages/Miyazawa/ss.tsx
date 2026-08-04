import React from 'react';
import './ss.css';

export default function UserInfo() {
  const handleTransferClick = () => {
    alert('送金画面へ移動します');
  }; 

  return (
    <div className="container">
      {/* スマホの画面枠 */}
      <div className="phone-frame">
        
        {/* ユーザヘッダー（アイコン ＋ 氏名） */}
        <div className="user-header">
          <div className="avatar">
            {/* 仮のアイコン画像（プレースホルダー） */}
            <img 
              src="https://via.placeholder.com/60" 
              alt="ユーザアイコン" 
              className="avatar-img" 
            />
          </div>
          <h2 className="user-name">サンプル 氏名</h2>
        </div>

        {/* 口座番号 */}
        <div className="account-section">
          <span className="account-label">口座番号</span>
          <span className="account-number">0000000</span>
        </div>

        {/* 預金残高ボックス */}
        <div className="balance-box">
          <span className="balance-title">預金残高</span>
          <span className="balance-value">50,000円</span>
        </div>

        {/* 送金するボタン */}
        <button onClick={handleTransferClick} className="transfer-button">
          <span className="button-icon">👝</span>
          <span className="button-text">送金する</span>
          <span className="arrow">＞</span>
        </button>

      </div>
    </div>
  );
}