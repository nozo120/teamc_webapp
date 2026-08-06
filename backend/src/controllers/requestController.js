import { createRequestLink } from "../services/requestService.js";
export const registerRequest = (req, res) => {
    const { amount, message, requesterId, payerId } = req.body;
    const requestLink = createRequestLink(amount, message, requesterId, payerId);
    res.json(requestLink);
};
//# sourceMappingURL=requestController.js.map