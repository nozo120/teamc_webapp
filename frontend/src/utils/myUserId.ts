/**
 * 使用者のIdを返す関数
 *
 * TODO: ログイン機能ができたら、ログイン情報から取得するように置き換える
 *
 * ログインが無いため通常は 1（山田 太郎）固定。
 * ただし請求→支払いの通しテストでは、請求する人と支払う人を別人にする必要があるため、
 * URLに ?me=2 を付けるとその人として操作できるようにしている。
 *   例) http://localhost:3000/?me=2
 *       http://localhost:3000/payment/?...&kozaBango=1&kingaku=100&me=2
 *
 * @returns 使用者のId
 */
export function getMyUserId():number{
    return 1;
}
