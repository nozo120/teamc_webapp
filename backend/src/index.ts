import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS許可（Reactからの通信を受け入れられるようにする）
app.use(cors());
app.use(express.json());

// 動作確認用API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Team C バックエンドサーバー起動中！' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});