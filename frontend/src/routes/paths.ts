// src/routes/paths.ts
// 画面のパスはここでしか書かない（タイプミス防止＆URL変更を一箇所で吸収する）
export const PATHS = {
  // アプリを開いて最初に出る画面。IDを入力して使用者を決める
  LOGIN: '/',
  HOME: '/home',        // ユーザ情報（マイページ）。ログイン後の遷移先
  USER_LIST: '/users',  // 送金相手を選択
  TRANSFER: '/transfer',// 送金入力
  COMPLETE: '/complete',// 送金完了
  INVOICE_USER_LIST: '/invoice/users', // 請求先を選択
  INVOICE_CREATE: '/invoice/new',      // 請求リンクを作成
  INVOICE_COMPLETE: '/invoice/complete', // 請求リンクの作成完了
} as const;
