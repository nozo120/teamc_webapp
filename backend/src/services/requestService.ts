export const createRequestLink = (
  amount: number,
  message: string | undefined,
  requesterId: number,
  payerId: number | null = null
) => {

  const requestId = crypto.randomUUID();

  const createdAt = new Date();

  const requestLink = `https://example.com/request/${requestId}`;

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