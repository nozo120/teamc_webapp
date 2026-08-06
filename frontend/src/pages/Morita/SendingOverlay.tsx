// SendingOverlay.tsx
// 送金・支払いの通信中に画面全体へかぶせる進行演出。
// 「自分のアイコン → 相手のアイコン」へお金が飛んでいく様子を見せて、待ち時間を短く感じさせる
import "./SendingOverlay.css";

type Props = {
  toName: string;     // 送り先の名前
  toImageUrl: string; // 送り先のアイコン
  label?: string;     // 「送金中」「支払い中」など
};

const SendingOverlay: React.FC<Props> = ({ toName, toImageUrl, label = "送金中" }) => (
  <div className="sending-overlay">
    <div className="sending-track">
      {/* 左：自分 */}
      <div className="sending-endpoint">
        <div className="sending-avatar self" />
      </div>

      {/* 中央：飛んでいくお金 */}
      <div className="sending-line">
        <span className="sending-coin">￥</span>
      </div>

      {/* 右：相手 */}
      <div className="sending-endpoint">
        <div className="sending-avatar">
          <img src={toImageUrl} alt={toName} />
        </div>
      </div>
    </div>

    <p className="sending-label">{label}...</p>
    <p className="sending-note">画面を閉じないでください</p>
  </div>
);

export default SendingOverlay;
