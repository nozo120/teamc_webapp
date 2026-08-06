import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    // 古いテストデータを削除（初期化用）
    await prisma.transaction.deleteMany();
    await prisma.request.deleteMany();
    await prisma.user.deleteMany();
    // 1. テスト用ユーザーの作成
    const user1 = await prisma.user.create({
        data: {
            id: 1,
            name: '山田 太郎 (Aさん)',
            accountNumber: '1000001',
            balance: 10000,
            userIconURL: 'https://placehold.co/100x100?text=A',
        },
    });
    const user2 = await prisma.user.create({
        data: {
            id: 2,
            name: '佐藤 花子 (Bさん)',
            accountNumber: '1000002',
            balance: 5000,
            userIconURL: 'https://placehold.co/100x100?text=B',
        },
    });
    const user3 = await prisma.user.create({
        data: {
            id: 3,
            name: '鈴木 一郎 (Cさん)',
            accountNumber: '1000003',
            balance: 8000,
            userIconURL: 'https://placehold.co/100x100?text=C',
        },
    });
    // 2. 過去の送金履歴（取引先として画面に初期表示させたいデータ）も追加しておく
    await prisma.transaction.create({
        data: {
            senderId: user1.id,
            receiverId: user2.id,
            amount: 1000,
            message: 'ランチ代の精算',
        },
    });
    console.log('✅ テストデータの投入が完了しました！');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map