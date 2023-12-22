import httpStatus from "http-status";
import { CONTROLLER, VALIDATOR } from "../../utils/constants";
import { sendResponse } from "../../utils/sendResponse";
import { Joi, celebrate } from "celebrate";
import { AppDataSource } from "../../database/config";
import Chat from "../../database/entity/Chat.entity";
import UserChat from "../../database/entity/UserChat.entity";
import Message from "../../database/entity/Message.entity";
import UserReadby from "../../database/entity/UserReadby.entity";

// const createNewChat = {
//     [VALIDATOR]: celebrate({
//         params: Joi.object()
//             .keys({
//                 user_id: Joi.string().uuid().required(),
//             })
//             .required(),
//     }),
//     [CONTROLLER]: async (req, res) => {
//         const { user_id } = req.params;
//         const chatRepo = AppDataSource.getRepository(Chat);
//         const foundChat = await chatRepo.query(`
//         select c.id as id, c.chat_name as chat_name, c.created_at as created_at
//         from chats c
//         join user_chats uc
//         on c.id = uc.chat_id
//         where c.is_group_chat = 'false'
//         and uc.user_id in ('${user_id}', '${req.currentUser.id}')
//         group by 1, 2, 3
//         having count(distinct uc.user_id) = 2;
//         `);
//         if (foundChat && foundChat.length)
//             return sendResponse(
//                 res,
//                 foundChat[0],
//                 "Chat found successfully",
//                 true,
//                 httpStatus.OK
//             );
//         const userChatRepo = AppDataSource.getRepository(UserChat);
//         // creating new chat if not exist;
//         const newChat = await chatRepo.save({});
//         await userChatRepo.save([
//             { chats: newChat, users: user_id },
//             { chats: newChat, users: req.currentUser.id },
//         ]);
//         return sendResponse(
//             res,
//             newChat,
//             "Chat got successfully",
//             true,
//             httpStatus.OK
//         );
//     },
// };

const getAllMessages = {
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
        let chat: any = foundChat[0];
        if (!foundChat || !foundChat.length) {
            const userChatRepo = AppDataSource.getRepository(UserChat);
            // creating new chat if not exist;
            chat = await chatRepo.save({});
            await userChatRepo.save([
                { chats: chat, users: user_id },
                { chats: chat, users: req.currentUser.id },
            ]);
        }
        // getting all messages of current chat
        const allMessages = await AppDataSource.getRepository(Message)
            .createQueryBuilder("messages")
            .select([
                "messages",
                "messageSender.id",
                "readbyMessage",
                "userReadby.id",
            ])
            .leftJoin("messages.readbyMessage", "readbyMessage")
            .leftJoin("messages.messageSender", "messageSender")
            .leftJoin("readbyMessage.userReadby", "userReadby")
            .where(`messages.userChat = '${chat.id}'`)
            .orderBy("messages.created_at", "ASC")
            .getMany();
        const response = {
            ...chat,
            messages: allMessages,
        };
        return sendResponse(
            res,
            response,
            "Chat got successfully",
            true,
            httpStatus.OK
        );
    },
};

const sendPrivateMessage = {
    [VALIDATOR]: celebrate({
        params: Joi.object()
            .keys({
                chat_id: Joi.string().uuid().required(),
            })
            .required(),
        body: Joi.object()
            .keys({
                content: Joi.string().required(),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        const chat_id = req.params.chat_id;
        const content = req.body.content;
        const messageRepo = AppDataSource.getRepository(Message);
        const readyByRepo = AppDataSource.getRepository(UserReadby);
        const messageSaved = await messageRepo.save({
            messageSender: req.currentUser.id,
            content,
            userChat: chat_id,
        });
        await readyByRepo.save({
            messageReadby: messageSaved,
            userReadby: req.currentUser.id,
        });
        return sendResponse(
            res,
            {},
            "Message saved successfully",
            true,
            httpStatus.OK
        );
    },
};
export { getAllMessages, sendPrivateMessage };
