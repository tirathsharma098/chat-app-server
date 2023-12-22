import express from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
    // createNewChat,
    getAllMessages,
    sendPrivateMessage,
} from "../controllers/chat";
const router = express.Router();

// router.post(
//     "/create-new-chat/:user_id",
//     createNewChat.validator,
//     catchAsync(createNewChat.controller)
// );
router.get(
    "/all-messages/:user_id",
    getAllMessages.validator,
    catchAsync(getAllMessages.controller)
);
router.post(
    "/send-message/:chat_id",
    sendPrivateMessage.validator,
    catchAsync(sendPrivateMessage.controller)
);
export default router;
