import type { Request, Response } from "express";
import {
  findAllUsers,
  findUserById,
  findUsersByAccountNumber,
} from "../services/userService.js";

/**
 * GET /users
 * GET /users?accountNumber=1000001
 *
 * クエリが付いていれば口座番号で絞り込む。どちらも配列を返す。
 * 移行前の json-server と同じ形式にして、フロント側を書き換えずに済むようにしている。
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { accountNumber } = req.query;

    if (typeof accountNumber === "string" && accountNumber !== "") {
      return res.json(await findUsersByAccountNumber(accountNumber));
    }

    return res.json(await findAllUsers());
  } catch (error) {
    console.error("ユーザー一覧の取得エラー:", error);
    return res.status(500).json({ message: "ユーザー一覧の取得に失敗しました" });
  }
};

/**
 * GET /users/:id
 * 見つからなければ404を返す（フロントは response.ok で判定している）
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // 数値以外が来た場合。Number("abc") は NaN になる
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "ユーザーIDが不正です" });
    }

    const user = await findUserById(id);

    if (user === null) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    return res.json(user);
  } catch (error) {
    console.error("ユーザー取得エラー:", error);
    return res.status(500).json({ message: "ユーザー情報の取得に失敗しました" });
  }
};
