export const createRequestLink = (amount, message, requesterId, payerId = null) => {
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
//# sourceMappingURL=requestService.js.map