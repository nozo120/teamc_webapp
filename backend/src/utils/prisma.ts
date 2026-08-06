import { PrismaClient } from "@prisma/client";

// PrismaClient はアプリ全体で1つだけ作って使い回す。
// サービスごとに new すると、その数だけDBへの接続が張られる。
// Supabase は同時接続数に上限があるため、増やさないようにする。
export const prisma = new PrismaClient();
