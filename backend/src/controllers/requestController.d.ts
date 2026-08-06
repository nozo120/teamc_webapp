import type { Request, Response } from "express";
interface RequestBody {
    amount: number;
    message?: string;
    requesterId: number;
    payerId?: number | null;
}
export declare const registerRequest: (req: Request<{}, {}, RequestBody>, res: Response) => void;
export {};
//# sourceMappingURL=requestController.d.ts.map