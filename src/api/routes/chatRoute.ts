import express from "express";
import { catchAsync } from "../../utils/catchAsync";
import { createNewChat } from "../controllers/chat";
const router = express.Router();

router.post(
    "/create-new-chat/:user_id",
    createNewChat.validator,
    catchAsync(createNewChat.controller)
);

export default router;
