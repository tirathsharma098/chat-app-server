import express, { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
const router = express.Router();

router.all("*", (req: Request, res: Response) => {
    sendResponse(res, {}, "Requested page not found", false, 404);
});

export default router;
