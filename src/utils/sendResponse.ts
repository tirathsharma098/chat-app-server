import { Response } from "express";

export const sendResponse = (
    res: Response,
    data: object = {},
    message: string = "",
    success: boolean = false,
    status: number = 400
) => {
    return res.status(status).json({ data, message, success });
};
