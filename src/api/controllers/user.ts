import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { AppDataSource } from "../../database/config";
import { sendResponse } from "../../utils/sendResponse";
import User from "../../database/entity/User.entity";
import bcrypt from "bcrypt";
import { getJWTToken } from "../../utils/jwt.helper";
import Token from "../../database/entity/Token.entity";
import {
    CONTROLLER,
    GetEnumQuery,
    MakeQueryForMultipleValues,
    OTP_TYPE,
    REGEX_EMAIL,
    REGEX_PASSWORD,
    REGEX_USERNAME,
    VALIDATOR,
} from "../../utils/constants";
import moment from "moment";
import { Not } from "typeorm";

const userLogin = {
    [VALIDATOR]: celebrate({
        body: Joi.object()
            .keys({
                username: Joi.string().min(4).max(100).required(),
                password: Joi.string().min(8).max(70).required(),
            })
            .required(),
    }),
    [CONTROLLER]: async (req: any, res: Response) => {
        const { password, username } = req.body;
        const userRepo = AppDataSource.getRepository(User);
        const gotUser = await userRepo.findOne({
            where: [
                {
                    username: username,
                },
                {
                    email: username,
                },
            ],
        });
        // If user not found save auth log and send false
        if (!gotUser)
            return sendResponse(
                res,
                {},
                "Email, Username or Password is Incorrect",
                false,
                httpStatus.OK
            );

        // if password not match return user
        const isMatch = await bcrypt.compare(password, gotUser.password);
        if (!isMatch)
            return sendResponse(
                res,
                {},
                "Email, Username or Password is Incorrect",
                false,
                httpStatus.OK
            );
        // check if user is not verified or inactive
        // creating jwt token for user auth
        const tokenGot = getJWTToken({
            id: gotUser.id,
        });
        const tokenRepo = AppDataSource.getRepository(Token);
        const expiryDate = moment(new Date(), "YYYY-MM-DD")
            .add(30, "days")
            .toString();
        // adding created token into token table to validate token
        const newTokenData = {
            userCreatedToken: gotUser,
            valid_till: expiryDate,
            user_ip: req.ip,
            token: tokenGot,
        };
        const tokenDataCreated = tokenRepo.create(newTokenData);
        await tokenRepo.save(tokenDataCreated);
        const userToSend = {
            id: gotUser.id,
            token: tokenGot,
            full_name: gotUser.full_name,
        };
        return sendResponse(
            res,
            userToSend,
            "User LoggedIn successfully",
            true,
            httpStatus.OK
        );
    },
};

const registerUser = {
    [VALIDATOR]: celebrate({
        body: Joi.object()
            .keys({
                full_name: Joi.string()
                    .required()
                    .label("Full Name")
                    .messages({ "*": "Please enter Full Name" }),
                username: Joi.string()
                    .regex(REGEX_USERNAME)
                    .required()
                    .messages({
                        "*": "Please enter Username of {full_name}",
                    }),
                email: Joi.string()
                    .email()
                    .regex(REGEX_EMAIL)
                    .allow("")
                    .messages({
                        "*": "Please enter valid email of {full_name}",
                    }),
                password: Joi.string().min(8).max(70).required(),
            })
            .required(),
    }),
    [CONTROLLER]: async (req: any, res: Response) => {
        const { full_name, username, email, password } = req.body;

        const userRepo = AppDataSource.getRepository(User);
        // Checking if user with same email or username already exists
        const foundUser = await userRepo.findOne({
            where: [{ email }, { username }],
        });
        if (foundUser)
            return sendResponse(
                res,
                {},
                "User with same email already exists",
                false,
                httpStatus.OK
            );
        const encryptPassword: string = await bcrypt.hash(password, 12);
        const newUser = {
            full_name,
            username,
            password: encryptPassword,
            email: email ? email : null,
        };
        const newUserCreated = userRepo.create(newUser);
        await userRepo.save(newUserCreated);

        return sendResponse(
            res,
            {},
            "User added successfully",
            true,
            httpStatus.OK
        );
    },
};

const userLogout = {
    [CONTROLLER]: async (req: any, res: Response) => {
        const tokenRepo = AppDataSource.getRepository(Token);
        const tokenDeleted = await tokenRepo
            .createQueryBuilder("token")
            .delete()
            .from(Token)
            .where("user = :user_id", { user_id: req?.currentUser?.id })
            .execute();
        if (!tokenDeleted) {
            return sendResponse(
                res,
                {},
                "Something wrong happened while log out user",
                false,
                httpStatus.OK
            );
        }
        return sendResponse(
            res,
            {},
            "User logged out successfully",
            true,
            httpStatus.OK
        );
    },
};

const getAllUserDropdown = {
    [CONTROLLER]: async (req, res) => {
        const userRepo = AppDataSource.getRepository(User);
        const allUser = await userRepo.find({
            where: { id: Not(req.currentUser.id) },
            select: { id: true, full_name: true, username: true },
        });
        return sendResponse(
            res,
            allUser,
            "User dropdown got successfully",
            true,
            httpStatus.OK
        );
    },
};

export { userLogin, registerUser, userLogout, getAllUserDropdown };
