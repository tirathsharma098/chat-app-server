import express from "express";
const router = express.Router();
import { expressjwt as jwt } from "express-jwt";
const jwtSecret = process.env.SECRET_KEY;
import { ValidateUser } from "../../utils/validateUser";

// Importing All routes
import notFound from "./notFoundRoute";
import userRoute from './userRoute'
// import { catchAsync } from "../../utils/catchAsync";

// Validating token secret
router.use(
    jwt({ algorithms: ["HS256"], secret: jwtSecret }).unless({
        path: [
            // /^\/api\/v1\/user\/login/,
            "/api/v1/user/login",
            "/api/v1/user/signup",
        ],
    })
);

// User routes

// Validating Below routes
router.use('/user', userRoute);
router.use(ValidateUser.controller);
// All version v1 routes

// Page not found route
router.all("*", notFound);

export default router;
