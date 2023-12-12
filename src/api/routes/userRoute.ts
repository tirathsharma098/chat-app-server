import express from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ValidateUser } from "../../utils/validateUser";
import {
    getAllUserDropdown,
    registerUser,
    userLogin,
    userLogout,
} from "../controllers/user";
const router = express.Router();

router.post("/login", userLogin.validator, catchAsync(userLogin.controller));
router.post(
    "/signup",
    registerUser.validator,
    catchAsync(registerUser.controller)
);
// Validating below routes
router.use(ValidateUser.controller);
router.put("/logout", catchAsync(userLogout.controller));

router.get("/get-all-dropdown", catchAsync(getAllUserDropdown.controller));

export default router;
