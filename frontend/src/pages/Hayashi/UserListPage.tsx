// src/pages/Hayashi/UserListPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { user } from '../../user';
import { getUsers } from './api/userApi';
import "./UserListPage.css";
export function UserListPage() {
  const [userList, setUserList] = useState<user[]>([]);
  const navigate = useNavigate();

  //useEffect(() => {},[])のときは最初に一度だけ実行される
  useEffect(() => {
    // 画面表示時に getUsers() を呼び出す

    getUsers()
      //thenはデータを取得できたときに動く
      .then((data) => {
        setUserList(data);
      })
      .catch((err) => {
        console.error("顧客データの取得に失敗しました");
      });
  }, []);


  return (
    // スマホ枠を画面中央に置くための外側
    <div className='phone-container'>
      <div className='phone'>
        <h2 className='phone-title'>送金相手を選択</h2>
        <ul className='user-list'>
          {userList.map((user) => (
            <li
              key={user.accountNumber} // または user.id
              className='user-list-item'
            >
              <button className='user-button' onClick={() => {
                // 選択された顧客情報を state に載せて送金画面へ渡す
                navigate('/transfer', { state: { user } });
              }}>
                {/* userIconURL から画像を表示 */}
                <img
                  src={user.userIconURL}
                  alt={user.name}
                  className='user-icon'
                />
                <div className='user-name'>
                  {user.name}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}