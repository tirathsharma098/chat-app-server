import httpStatus from "http-status";

interface ExpressError extends Error {
    data?: object;
    success?: boolean;
    statusCode?: number;
    customMessage?: string;
}

class ExpressError extends Error {
    constructor(
        customMessage: string = "",
        success: boolean = false,
        statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
        data: object = {}
    ) {
        super();
        this.customMessage = customMessage;
        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
    }
}

export { ExpressError };
