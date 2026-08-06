/**
 * DBのデータを扱いやすいようにまとめたもの
 */
export type user = {
    id:string;//実DBに切り替えるときにnumber型にする
    userIconURL:string;
    accountNumber:number;
    name:string;
    balance:number;
}