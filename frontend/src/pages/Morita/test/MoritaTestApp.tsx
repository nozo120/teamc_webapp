// test/MoritaTestApp.tsx
// 自分の担当画面だけを動かすための、テスト専用の入口
import { MemoryRouter, Routes, Route } from "react-router-dom";
import TransferScreen from "../TransferScreen";
import TransferComplete from "../TransferComplete";
import TestSelectRecipient from "./TestSelectRecipient";
import { PATHS } from "../../../routes/paths";

const MoritaTestApp: React.FC = () => {
  // 自分の所持金・自分のID（本来はAPIから取得。テスト中は固定値）
  const myBalance = 80000;
  const myUserId = 1;

  return (
    // MemoryRouter … URLを変えずに画面遷移だけ動かすルーター
    // チーム本体のルーティングと干渉しにくい
    <MemoryRouter initialEntries={[PATHS.HOME]}>
      <Routes>
        <Route path={PATHS.HOME} element={<TestSelectRecipient />} />
        <Route path={PATHS.TRANSFER} element={<TransferScreen maxAmount={myBalance} senderId={myUserId} />} />
        <Route path={PATHS.COMPLETE} element={<TransferComplete />} />
      </Routes>
    </MemoryRouter>
  );
};

export default MoritaTestApp;
