// src/pages/Hayashi/UserListPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { user } from '../../user';
import { PATHS } from '../../routes/paths';
import { getUsers } from '../../utils/userApi';
import { getMyUserId } from '../../utils/myUserId';
import "../../styles/phone.css";
import "./UserListPage.css";

type Props = {
  // この一覧を「送金相手を選ぶため」に使うのか「請求先を選ぶため」に使うのか
  // 選んだあとの遷移先と渡すデータが変わるので、呼び出し側から指定してもらう
  mode: 'transfer' | 'invoice';
};

export function UserListPage({ mode }: Props) {
  const [userList, setUserList] = useState<user[]>([]);
  const navigate = useNavigate();

  //使用者のIdを取得
  const MY_USER_ID = getMyUserId();

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
        {/* 1つ前の画面（マイページ）に戻る */}
        <button className='phone-back-button' onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <h2 className='phone-title'>
          {mode === 'invoice' ? '請求先を選択' : '送金相手を選択'}
        </h2>
        <ul className='user-list'>
          {userList
            // 自分自身には送金できないのでリストから除外する
            // json-server は id を文字列("1")で返すので、数値に直してから比較する
            .filter((user) => Number(user.id) !== MY_USER_ID)
            .map((user) => (
            <li
              key={user.accountNumber} // または user.id
              className='user-list-item'
            >
              <button className='user-button' onClick={() => {
                if (mode === 'invoice') {
                  // 請求リンク作成画面へは顧客IDだけ渡す
                  // json-server は id を文字列で返すので数値に直す
                  navigate(PATHS.INVOICE_CREATE, { state: { recipientId: Number(user.id) } });
                } else {
                  // 選択された顧客情報を state に載せて送金画面へ渡す
                  navigate(PATHS.TRANSFER, { state: { recipient:user } });
                }
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