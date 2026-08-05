import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { PATHS } from '../../routes/paths';
import { getUser } from '../../utils/userApi'; // 1件取得するAPI関数
import { getMyUserId } from '../../utils/myUserId'; // getMyUserId 関数に変更
import { user } from '../../user'; // 共通の型
import './ss.css';

export default function UserInfo() {
  const navigate = useNavigate();

  // 自分のユーザー情報を保持するステート
  const [currentUser, setCurrentUser] = useState<user | null>(null);

  // 残高を表示しているかどうかを管理するステート（初期値: true = 表示）
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // 仮の送金履歴データ
  const [historyList] = useState([
    { id: 1, name: '山田 太郎', amount: 3000 },
    { id: 2, name: '鈴木 花子', amount: 5500 },
    { id: 3, name: '佐藤 一郎', amount: 10000 },
  ]);

  // 画面が表示されたときに自分のIDを取得し、それを使ってバックエンドからデータを取得する
  useEffect(() => {
    const myId = getMyUserId(); // 関数を実行してIDを取得する
    getUser(myId)
      .then((data: user) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.error("ユーザー情報の取得に失敗しました", err);
      });
  }, []);

  // 送金するボタンを押したときの処理
  const handleTransferClick = () => {
    navigate(PATHS.USER_LIST); // 送金相手選択画面へ遷移
  };

  // 請求するボタンを押したときの処理
  const handleRequestClick = () => {
    navigate(PATHS.INVOICE_USER_LIST); // 請求先選択画面へ遷移
  };

  return (
    <div className="container">
      {/* スマホの画面枠 */}
      <div className="phone-frame">
        
        {/* ユーザヘッダー（アイコン ＋ 氏名） */}
        <div className="user-header">
          <div className="avatar">
            <img 
              src={currentUser ? currentUser.userIconURL : "https://via.placeholder.com/60"} 
              alt="ユーザアイコン" 
              className="avatar-img" 
            />
          </div>
          <h2 className="user-name">
            {currentUser ? currentUser.name : '読み込み中...'}
          </h2>
        </div>

        {/* 口座番号 */}
        <div className="account-section">
          <span className="account-label">口座番号</span>
          <span className="account-number">
            {currentUser ? currentUser.accountNumber : '------'}
          </span>
        </div>

        {/* 預金残高ボックス */}
        <div className="balance-box">
          <span className="balance-title">預金残高</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="balance-value">
              {currentUser ? (
                isBalanceVisible ? `${currentUser.balance.toLocaleString()}円` : '＊＊＊＊＊＊'
              ) : (
                '読み込み中...'
              )}
            </span>
            <span 
              onClick={() => setIsBalanceVisible(!isBalanceVisible)} 
              style={{ cursor: 'pointer', fontSize: '16px' }}
              title="残高の表示切替"
            >
              {isBalanceVisible ? '👁️' : '🙈'}
            </span>
          </div>
        </div>

        {/* 送金履歴セクション（タイトル固定・リストのみスクロール） */}
        <div className="history-section">
          <p className="history-title">最近の送金履歴</p>
          <div className="history-list">
            {historyList.map((item) => (
              <div key={item.id} className="history-item">
                <span className="history-name">{item.name}</span>
                <span className="history-amount">-{item.amount.toLocaleString()}円</span>
              </div>
            ))}
          </div>
        </div>

        {/* ボタンをまとめるエリア（送金ボタン ＋ 請求ボタン） */}
        <div className="button-group" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
          
          {/* 送金するボタン */}
          <button onClick={handleTransferClick} className="transfer-button" style={{ margin: 0 }}>
            <span className="button-icon">👝</span>
            <span className="button-text">送金する</span>
            <span className="arrow">＞</span>
          </button>

          {/* 請求するボタン */}
          <button onClick={handleRequestClick} className="transfer-button" style={{ margin: 0 }}>
            <span className="button-icon">✉️</span>
            <span className="button-text">請求する</span>
            <span className="arrow">＞</span>
          </button>

        </div>

      </div>
    </div>
  );
}