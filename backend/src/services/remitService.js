import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function dealing(senderId, receiverId, amount) {
    if (amount <= 0) {
        throw new RangeError("送金金額が不適切です！");
    }
    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (sender === null || receiver === null) {
        throw new Error("該当する送信元または宛先が見つかりません");
    }
    if (senderId === receiverId) {
        throw new Error("送信元と宛先が同じです");
    }
    const new_sender_amount = sender.balance - amount;
    if (new_sender_amount < 0) {
        throw new RangeError("送金金額が預金残高を超えています");
    }
    const new_receiver_amount = receiver.balance + amount;
    await prisma.$transaction([
        prisma.user.update({
            where: { id: senderId },
            data: { balance: new_sender_amount },
        }),
        prisma.user.update({
            where: { id: receiverId },
            data: { balance: new_receiver_amount },
        }),
    ]);
    return "送金が完了しました！";
}
//# sourceMappingURL=remitService.js.map