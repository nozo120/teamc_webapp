// 仮App.tsx
// Morita担当分だけを動作確認するための仮エントリ。
// CRAの起点(src/index.tsx)は "./App" 固定で読み込むため、
// 本当にブラウザで表示するには index.tsx 側の import 一行だけを
// 一時的にこのファイルに向ける必要がある。(index.tsxはMorita外なので
// 書き換え・復元は必ず自分の手で行うこと)
import MoritaTestApp from "./test/MoritaTestApp";

const 仮App: React.FC = () => <MoritaTestApp />;

export default 仮App;
