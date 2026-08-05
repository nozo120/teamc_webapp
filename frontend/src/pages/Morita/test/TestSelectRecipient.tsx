// test/TestSelectRecipient.tsx
import { useNavigate } from "react-router-dom";
import type { User } from "../types";

// テスト用ダミーデータ
const dummyUsers: User[] = [
  { id: "2", name: "佐藤次郎", imageUrl: "/images/human2.png" },
  { id: "3", name: "佐藤三郎", imageUrl: "/images/human3.png" },
  { id: "4", name: "佐々木花子", imageUrl: "/images/human4.png" },
];

const TestSelectRecipient: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h2>【テスト】送金相手を選択</h2>
      {dummyUsers.map((user) => (
        <div
          key={user.id}
          // 本番の顧客リスト画面でも、この形で渡してもらう
          onClick={() => navigate("/transfer", { state: { recipient: user } })}
          style={{ padding: 16, borderBottom: "1px solid #ccc", cursor: "pointer" }}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
};

export default TestSelectRecipient;
