// src/routes/paths.ts
// 画面のパスはここでしか書かない（タイプミス防止＆URL変更を一箇所で吸収する）
export const PATHS = {
  HOME: '/',            // ユーザ情報（マイページ）
  USER_LIST: '/users',  // 送金相手を選択
  TRANSFER: '/transfer',// 送金入力
  COMPLETE: '/complete',// 送金完了
} as const;
