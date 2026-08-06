import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { PATHS } from './routes/paths';
import UserInfo from './pages/Miyazawa/ss';
import { UserListPage } from './pages/Hayashi/UserListPage';
import { InvoicelinkCreationPage } from './pages/Hayashi/InvoicelinkCreationPage';
import { LoginPage } from './pages/Hayashi/LoginPage';
import { getUser } from './utils/userApi';
import { getMyUserId } from './utils/myUserId';
// TransferScreen は default export なので { } は付けない
import TransferScreen from './pages/Morita/TransferScreen';
import TransferComplete from './pages/Morita/TransferComplete';
import PaymentScreen from './pages/Morita/PaymentScreen';
// RequestScreen は default export なので { } は付けない
import RequestScreen from './pages/Miyazawa/RequestScreen';

// ルート定義は BrowserRouter の内側に置く。
// LoginPage が setMyUserId() で使用者を切り替えるため、
// useLocation() で画面遷移のたびに再描画させ、そのつど getMyUserId() を読み直している。
// （BrowserRouter の外側で一度だけ読むと、ログインしても古いIDのままになる）
function AppRoutes() {
  const { pathname } = useLocation();

  const MY_USER_ID = getMyUserId();

  // 自分の所持金。取得できるまでは null（＝読み込み中）
  const [myBalance, setMyBalance] = useState<number | null>(null);

  // 画面が変わるたびに取り直す。
  // ログイン直後の切り替えに追従できるほか、送金後の残高も最新になる
  useEffect(() => {
    getUser(MY_USER_ID)
      .then((me) => {
        setMyBalance(me.balance);
      })
      .catch(() => {
        console.error('所持金の取得に失敗しました');
      });
  }, [pathname, MY_USER_ID]);

  return (
      <Routes>
        {/* IDを入力して使用者を切り替える画面 */}
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.HOME} element={<UserInfo />} />
        {/* 同じ一覧を、送金相手を選ぶ用と請求先を選ぶ用で使い分ける */}
        <Route path={PATHS.USER_LIST} element={<UserListPage mode='transfer' />} />
        <Route path={PATHS.INVOICE_USER_LIST} element={<UserListPage mode='invoice' />} />
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
        {/* 送金完了画面 */}
        <Route path={PATHS.COMPLETE} element={<TransferComplete />} />
        {/* 請求リンクの作成画面 */}
        <Route path={PATHS.INVOICE_CREATE} element={<InvoicelinkCreationPage />} />
        {/* 請求リンクの作成完了画面。作成した請求は InvoicelinkCreationPage から state で渡される */}
        <Route path={PATHS.INVOICE_COMPLETE} element={<RequestScreen />} />
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
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
