import httpStatus from "http-status";
import { CONTROLLER, VALIDATOR } from "../../utils/constants";
import { sendResponse } from "../../utils/sendResponse";
import { Joi, celebrate } from "celebrate";
import { AppDataSource } from "../../database/config";
import Chat from "../../database/entity/Chat.entity";
import UserChat from "../../database/entity/UserChat.entity";

const createNewChat = {
    [VALIDATOR]: celebrate({
        params: Joi.object()
            .keys({
                user_id: Joi.string().uuid().required(),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        const { user_id } = req.params;
        const chatRepo = AppDataSource.getRepository(Chat);
        const foundChat = await chatRepo.query(`
        select c.id as id, c.chat_name as chat_name, c.created_at as created_at
        from chats c
        join user_chats uc
        on c.id = uc.chat_id
        where c.is_group_chat = 'false'
        and uc.user_id in ('${user_id}', '${req.currentUser.id}')
        group by 1, 2, 3
        having count(distinct uc.user_id) = 2;
        `);
        if (foundChat && foundChat.length)
            return sendResponse(
                res,
                foundChat[0],
                "Chat found successfully",
                true,
                httpStatus.OK
            );
        const userChatRepo = AppDataSource.getRepository(UserChat);
        // creating new chat if not exist;
        const newChat = await chatRepo.save({});
        await userChatRepo.save([
            { chats: newChat, users: user_id },
            { chats: newChat, users: req.currentUser.id },
        ]);
        return sendResponse(
            res,
            newChat,
            "Chat got successfully",
            true,
            httpStatus.OK
        );
    },
};
export { createNewChat };
