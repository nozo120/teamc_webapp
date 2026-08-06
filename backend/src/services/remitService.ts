import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export async function dealing(senderId: number, receiverId: number, amount: number, message: string)
{if (amount <= 0) {throw new RangeError( "送金金額が不適切です!")};
 
    const sender = await prisma.user.findUnique({where: {id: senderId}});
const receiver = await prisma.user.findUnique({where: {id: receiverId}});
if (sender === null || receiver === null)
{throw new Error( "該当する送信元または宛先が見つかりません")}

else {const new_sender_amount = sender.balance - amount;
    const new_receiver_amount = receiver.balance + amount;
    if (new_sender_amount < 0) {throw new RangeError( "送金額が預金残高を超過しています!")}
    else if (senderId === receiverId) {throw new Error ("送金元と宛先が同じです!")}
    else { 
        await prisma.$transaction([prisma.user.update({where: {id: senderId}, data: {balance: new_sender_amount}})
            , prisma.user.update({where: {id: receiverId}, data: {balance: new_receiver_amount}}),
            prisma.transaction.create({data: {senderId, receiverId, amount, message}})
        ]);
        
        return "送金が完了しました!"}}


}

// 2. 送金履歴テーブル

// model Transaction {
//     id         Int      @id @default(autoincrement())
//     senderId   Int
//     receiverId Int
//     amount     Int
//     message    String?
//     createdAt  DateTime @default(now())
  
//     sender   User @relation("SentTransactions", fields: [senderId], references: [id])
//     receiver User @relation("ReceivedTransactions", fields: [receiverId], references: [id])
  
//     @@index([senderId])
//     @@index([receiverId])
//   }