// test/MoritaTestApp.tsx
// 自分の担当画面だけを動かすための、テスト専用の入口
import { MemoryRouter, Routes, Route } from "react-router-dom";
import TransferScreen from "../TransferScreen";
import TestSelectRecipient from "./TestSelectRecipient";
import TestTransferComplete from "./TestTransferComplete";

const MoritaTestApp: React.FC = () => {
  // 自分の所持金（本来はAPIから取得。テスト中は固定値）
  const myBalance = 80000;

  return (
    // MemoryRouter … URLを変えずに画面遷移だけ動かすルーター
    // チーム本体のルーティングと干渉しにくい
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<TestSelectRecipient />} />
        <Route path="/transfer" element={<TransferScreen maxAmount={myBalance} />} />
        <Route path="/transfer-complete" element={<TestTransferComplete />} />
      </Routes>
    </MemoryRouter>
  );
};

export default MoritaTestApp;
