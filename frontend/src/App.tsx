import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { PATHS } from './routes/paths';
import UserInfo from './pages/Miyazawa/ss';
import { UserListPage } from './pages/Hayashi/UserListPage';
import { getUser } from './utils/userApi';
import { getMyUserId } from './utils/myUserId';
// TransferScreen は default export なので { } は付けない
import TransferScreen from './pages/Morita/TransferScreen';
import TransferComplete from './pages/Morita/TransferComplete';
import PaymentScreen from './pages/Morita/PaymentScreen';

// TODO: ログイン機能ができたら、自分のIDはログイン情報から取得する
const MY_USER_ID = getMyUserId();

function App() {
  // 自分の所持金。取得できるまでは null（＝読み込み中）
  const [myBalance, setMyBalance] = useState<number | null>(null);

  // 起動時に一度だけ、自分のユーザー情報をDBから取得する
  useEffect(() => {
    getUser(MY_USER_ID)
      .then((me) => {
        setMyBalance(me.balance);
      })
      .catch(() => {
        console.error('所持金の取得に失敗しました');
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.HOME} element={<UserInfo />} />
        <Route path={PATHS.USER_LIST} element={<UserListPage />} />
        {/* 送金金額の入力画面。送金先は UserListPage から state で渡される */}
        {/* 所持金が取れるまでは TransferScreen を描画しない（上限0円で表示されるのを防ぐ） */}
        <Route
          path={PATHS.TRANSFER}
          element={
            myBalance === null
              ? <div>読み込み中...</div>
              : <TransferScreen maxAmount={myBalance} senderId={MY_USER_ID} />
          }
        />
        {/* TODO: 送金完了画面ができたら element を差し替える */}
        <Route path={PATHS.COMPLETE} element={<TransferComplete />} />
        {/* 請求リンクから開く支払い画面 */}
        <Route
          path="/payment"
          element={
            myBalance === null
              ? <div>読み込み中...</div>
              : <PaymentScreen maxAmount={myBalance} senderId={MY_USER_ID} />
          }
        />
        {/* 定義していないURLはホームに戻す */}
        <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
