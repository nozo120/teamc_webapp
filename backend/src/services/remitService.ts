import {PrismaClient} from "../../generated/prisma/client.js";
const prisma = new PrismaClient();
export async function dealing(senderId: number, receiverId: number, amount: number)
{if (amount <= 0) {return "送金金額が不適切です!"};
    const sender = await prisma.user.findUnique({where: {id: senderId}});
const receiver = await prisma.user.findUnique({where: {id: receiverId}});
if (sender === null || receiver === null)
{return "該当する送信元または宛先が見つかりません"}
else {const new_sender_amount = sender.balance - amount;
    const new_receiver_amount = receiver.balance + amount;
    if (new_sender_amount < 0) {return "送金額が預金残高を超過しています!"}
    else if (senderId === receiverId) {return "送金元と宛先が同じです!"}
    else { 
        await prisma.$transaction([prisma.user.update({where: {id: senderId}, data: {balance: new_sender_amount}})
            , prisma.user.update({where: {id: receiverId}, data: {balance: new_receiver_amount}})
        ]);
        return "送金が完了しました!"}}


}

