import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AppDataSource } from "../database/config";
import User from "../database/entity/User.entity";
import { decodeToken } from "./jwt.helper";
import { sendResponse } from "./sendResponse";
import Token from "../database/entity/Token.entity";
// import { USER_STATUS } from "./constants";

declare module "express" {
    export interface Request {
        currentUser?: User;
    }
}

export const ValidateUser = {
    controller: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userTokenGot = req.headers.authorization;
            const payloadOfToken = decodeToken(userTokenGot);
            if (!payloadOfToken?.id)
                return sendResponse(
                    res,
                    {},
                    "Token is not valid",
                    false,
                    httpStatus.UNAUTHORIZED
                );
            const tokenRepo = AppDataSource.getRepository(Token);
            const gotTokenData = await tokenRepo.findOne({
                where: {
                    token: userTokenGot,
                },
                relations: {
                    userCreatedToken: true
                },
            });
            if (
                !gotTokenData ||
                !payloadOfToken?.id ||
                payloadOfToken.id != gotTokenData.userCreatedToken.id
            ) {
                return sendResponse(
                    res,
                    {},
                    "User Validation Failed, Please login again",
                    false,
                    httpStatus.UNAUTHORIZED
                );
            }
            const todayDate = new Date().getTime();
            const valid_till = new Date(gotTokenData?.valid_till).getTime();
            if (!gotTokenData || todayDate > valid_till) {
                if (todayDate > valid_till)
                    await tokenRepo.delete({ token: userTokenGot });
                return sendResponse(
                    res,
                    {},
                    "Your Token has been expired, Please login again.",
                    false,
                    httpStatus.UNAUTHORIZED
                );
            }
            req.currentUser = {
                ...gotTokenData.userCreatedToken,
            };
            return next();
        } catch (err) {
            console.log(">> ERROR OCCURRED WHILE VALIDATING USER IN: ", err);
            return sendResponse(
                res,
                {},
                "Something unexpected happened While Validating User",
                false,
                httpStatus.BAD_REQUEST
            );
        }
    },
};
