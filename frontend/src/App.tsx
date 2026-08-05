import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { PATHS } from './routes/paths';
import UserInfo from './pages/Miyazawa/ss';
import { UserListPage } from './pages/Hayashi/UserListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.HOME} element={<UserInfo />} />
        <Route path={PATHS.USER_LIST} element={<UserListPage />} />
        {/* TODO: 送金画面ができたら element を差し替える */}
        <Route path={PATHS.TRANSFER} element={<div>送金画面（未実装）</div>} />
        {/* TODO: 送金完了画面ができたら element を差し替える */}
        <Route path={PATHS.COMPLETE} element={<div>送金完了画面（未実装）</div>} />
        {/* 定義していないURLはホームに戻す */}
        <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
