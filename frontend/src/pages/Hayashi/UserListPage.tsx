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

// 検索の照合用に文字列を揃える。
// DBの名前が "山田 太郎 (Aさん)" のように空白入りなので、
// 空白を落としておくと「山田太郎」と続けて打っても一致する
const normalize = (text: string) => text.replace(/\s+/g, '').toLowerCase();

export function UserListPage({ mode }: Props) {
  const [userList, setUserList] = useState<user[]>([]);

  // 検索欄に入力された文字。空文字のときは絞り込まない
  const [query, setQuery] = useState<string>('');

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

  // 画面に出す分だけを先に作っておく。0件判定にも使う
  const visibleUsers = userList
    // 自分自身には送金できないのでリストから除外する
    .filter((user) => user.id !== MY_USER_ID)
    // 名前での絞り込み。query が空なら includes('') が常に true になり全件通る
    .filter((user) => normalize(user.name).includes(normalize(query)));

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
        {/* 名前で絞り込む。入力するたびに一覧が変わる（通信は発生しない） */}
        <input
          type='search'
          className='user-search'
          placeholder='名前で検索'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <ul className='user-list'>
          {visibleUsers.length === 0 && (
            <li className='user-list-empty'>
              {/* 取得前と、取得済みだが0件（検索で絞り切った / 自分しか居ない）を区別する */}
              {userList.length === 0 ? '読み込み中...' : '該当する相手がいません'}
            </li>
          )}
          {visibleUsers
            .map((user) => (
            <li
              key={user.accountNumber} // または user.id
              className='user-list-item'
            >
              <button className='user-button' onClick={() => {
                if (mode === 'invoice') {
                  // 請求リンク作成画面へは顧客IDだけ渡す
                  navigate(PATHS.INVOICE_CREATE, { state: { recipientId: user.id } });
                } else {
                  // 選択された顧客情報を state に載せて送金画面へ渡す
                  navigate(PATHS.TRANSFER, { state: { recipient:user } });
                }
              }}>
                {/* userIconURL から画像を表示。DB上 null がありうるので未設定なら代替画像 */}
                <img
                  src={user.userIconURL ?? "https://via.placeholder.com/60"}
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