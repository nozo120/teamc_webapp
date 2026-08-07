export const createRequestLink = async (
  amount: number,
  message: string | undefined,
  requesterId: number,
  payerId: number
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

  // ホスト名は付けずパスだけを返す。
  // フロントのポートは人によって違うため、表示する側で window.location.origin を足す
  const requestLink =
    `/payment/?time=${formattedTime}` +
    `&kozaBango=${requesterId}` +
    `&payerId=${payerId}` +
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
    requestLink,
  };
};