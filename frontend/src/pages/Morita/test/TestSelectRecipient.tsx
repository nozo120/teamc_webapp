// test/TestSelectRecipient.tsx
import { useNavigate } from "react-router-dom";
import type { User } from "../types";
import { PATHS } from "../../../routes/paths";

// テスト用ダミーデータ（Hayashiさんの実データと同じ形: frontend/src/user.ts）
const dummyUsers: User[] = [
  { id: 2, name: "佐藤次郎", userIconURL: "/images/human2.png", accountNumber: 1000002, balance: 80000 },
  { id: 3, name: "佐藤三郎", userIconURL: "/images/human3.png", accountNumber: 1000003, balance: 80000 },
  { id: 4, name: "佐々木花子", userIconURL: "/images/human4.png", accountNumber: 1000004, balance: 80000 },
];

const TestSelectRecipient: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h2>【テスト】送金相手を選択</h2>
      {dummyUsers.map((user) => (
        <div
          key={user.id}
          // Hayashiさんの本番一覧画面と同じ形（{ recipient: user }）で渡す
          onClick={() => navigate(PATHS.TRANSFER, { state: { recipient: user } })}
          style={{ padding: 16, borderBottom: "1px solid #ccc", cursor: "pointer" }}
        >
          {user.name}
        </div>
      ))}

      {/* APIが未接続でも完了画面の見た目を確認できるプレビュー用リンク */}
      <hr style={{ margin: "24px 0" }} />
      <div
        onClick={() =>
          navigate(PATHS.COMPLETE, {
            state: { recipient: dummyUsers[0], amount: 5000, message: "ランチ代" },
          })
        }
        style={{ padding: 16, color: "#888", cursor: "pointer" }}
      >
        【プレビュー】完了画面を直接見る
      </div>
    </div>
  );
};

export default TestSelectRecipient;
