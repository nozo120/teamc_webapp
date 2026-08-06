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

  const requestLink =
    `http://localhost:3001/payment/?time=${formattedTime}` +
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