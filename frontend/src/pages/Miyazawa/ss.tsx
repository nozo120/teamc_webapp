import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { PATHS } from '../../routes/paths';
import { getUser } from '../../utils/userApi';
import { getMyUserId } from '../../utils/myUserId';
import { getTransactionHistory, TransactionHistory } from '../../utils/historyApi';
import { user } from '../../user';
import './ss.css';

export default function UserInfo() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<user | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // 取引履歴用のステート
  const [historyList, setHistoryList] = useState<TransactionHistory[]>([]);

  useEffect(() => {
    const myId = getMyUserId();

    // ユーザー情報の取得
    getUser(myId)
      .then((data: user) => {
        setCurrentUser(data);
      })
      .catch((err: Error) => {
        console.error("ユーザー情報の取得に失敗しました", err);
      });

    // 入出金履歴の取得（型を明示）
    getTransactionHistory(myId)
      .then((data: TransactionHistory[]) => {
        setHistoryList(data);
      })
      .catch((err: Error) => {
        console.error("入出金履歴の取得に失敗しました", err);
      });
  }, []);

  const handleTransferClick = () => {
    navigate(PATHS.USER_LIST);
  };

  const handleRequestClick = () => {
    navigate(PATHS.INVOICE_USER_LIST);
  };

  return (
    <div className="container">
      <div className="phone-frame">
        
        {/* トップバー */}
        <div className="yucho-top-bar">
          <div className="yucho-brand">
            <span className="yucho-logo-mark">口座</span>
            <span className="yucho-app-title">スマート決済アプリ</span>
          </div>
          <div className="yucho-help-icon">?</div>
        </div>

        {/* ユーザプロフィールエリア */}
        <div className="user-header">
          <div className="avatar">
            {/* アイコンはDB上 null がありうるので、未設定のときも代替画像にする */}
            <img
              src={currentUser?.userIconURL ?? "https://via.placeholder.com/60"}
              alt="ユーザアイコン" 
              className="avatar-img" 
            />
          </div>
          <div className="user-meta">
            <span className="user-greeting">ご契約者さま</span>
            <h2 className="user-name">
              {currentUser ? currentUser.name : '読み込み中...'} 様
            </h2>
          </div>
        </div>

        {/* 預金残高ボックス */}
        <div className="balance-box">
          <div className="balance-top-row">
            <span className="balance-title">普通預金残高</span>
            <span 
              onClick={() => setIsBalanceVisible(!isBalanceVisible)} 
              className="eye-btn"
              title="残高の表示切替"
            >
              {isBalanceVisible ? '非表示にする' : '表示する'}
            </span>
          </div>
          <div className="balance-value-row">
            <span className="balance-value">
              {currentUser ? (
                isBalanceVisible ? `${currentUser.balance.toLocaleString()}円` : '＊＊＊＊＊＊'
              ) : (
                '読み込み中...'
              )}
            </span>
          </div>
          <div className="balance-footer-row">
            <span className="account-label-text">口座番号：</span>
            <span className="account-number-text">{currentUser ? currentUser.accountNumber : '------'}</span>
          </div>
        </div>

        {/* メインアクションボタン（横並び） */}
        <div className="action-buttons-grid">
          <button onClick={handleTransferClick} className="action-card transfer-card">
            <div className="action-icon-circle red-theme">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </div>
            <div className="action-texts">
              <span className="action-title">送金する</span>
              <span className="action-sub">ほかの口座へ</span>
            </div>
          </button>

          <button onClick={handleRequestClick} className="action-card request-card">
            <div className="action-icon-circle red-theme">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div className="action-texts">
              <span className="action-title">請求する</span>
              <span className="action-sub">リンクを作成</span>
            </div>
          </button>
        </div>

        {/* 取引履歴セクション */}
        <div className="history-section">
          <div className="history-header-area">
            <span className="history-title">入出金明細 (直近)</span>
            <span className="history-all">一覧を見る</span>
          </div>
          <div className="history-list">
            {historyList.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '20px' }}>
                明細はありません
              </p>
            ) : (
              historyList.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-left">
                    <div className="history-icon-dot"></div>
                    <div className="history-info">
                      <span className="history-name">{item.name}</span>
                      <span className="history-date">{item.date}</span>
                    </div>
                  </div>
                  <span className="history-amount">-{item.amount.toLocaleString()}円</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}