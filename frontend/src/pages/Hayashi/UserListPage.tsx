// src/pages/Hayashi/UserListPage.tsx
import React, { useEffect, useState } from 'react';
import { User } from './User';
import { getUsers } from './api/userApi';

export function UserListPage() {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 画面表示時に getUsers() を呼び出す
    getUsers()
      .then((data) => {
        setUserList(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>ユーザー一覧を読み込み中...</div>;
  if (error) return <div style={{ color: 'red' }}>エラー: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>ユーザー一覧</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {userList.map((user) => (
          <li
            key={user.accountNumber} // または user.id
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '12px',
              borderBottom: '1px solid #eee',
            }}
          >
            {/* userIconURL から画像を表示 */}
            <img
              src={user.userIconURL}
              alt={user.name}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {user.name}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                口座番号: {user.accountNumber}
              </div>
              <div style={{ color: '#333', fontSize: '0.95rem' }}>
                残高: {user.balance.toLocaleString()} 円
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}