// Toast.tsx
// 画面上部に一時的に出て、自動で消えるエラー通知
import { useEffect } from "react";
import "./Toast.css";

type Props = {
  message: string;
  onClose: () => void;
};

const Toast: React.FC<Props> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
    // onCloseは呼び出し側で再生成されるたびに再セットしなくてよいので依存に含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return (
    <div className="toast" role="alert" onClick={onClose}>
      {message}
    </div>
  );
};

export default Toast;
