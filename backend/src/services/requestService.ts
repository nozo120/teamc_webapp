export const createRequestLink = (
  amount: number,
  message: string | undefined,
  requesterId: number,
  payerId: number | null = null
) => {

  const requestId = crypto.randomUUID();

  const createdAt = new Date();

  const formattedTime =
    `${createdAt.getFullYear()}-` +
    `${String(createdAt.getMonth() + 1).padStart(2, "0")}-` +
    `${String(createdAt.getDate()).padStart(2, "0")}-` +
    `${String(createdAt.getHours()).padStart(2, "0")}-` +
    `${String(createdAt.getMinutes()).padStart(2, "0")}-` +
    `${String(createdAt.getSeconds()).padStart(2, "0")}-` +
    `${String(createdAt.getMilliseconds()).padStart(3, "0")}`;

  // 支払い画面は React のページなので、配信元はフロント(3000)。
  // バックエンド(3001)には /payment ルートが無いため、3001 のままだと 404 になる
  const requestLink =
    `http://localhost:3000/payment/?time=${formattedTime}` +
    `&kozaBango=${requesterId}` +
    `&kingaku=${amount}` +
    `&message=${encodeURIComponent(message ?? "")}`;

  return {
    id: requestId,
    requesterId,
    payerId,
    amount,
    message: message ?? null,
    status: "pending",
    createdAt,
    requestLink
  };
};