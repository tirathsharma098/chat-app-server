import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import User from "./User.entity";
import Chat from "./Chat.entity";

@Entity("user_chats")
export default class UserChat {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Chat, chat => chat.userChat)
    @JoinColumn({ name: "chat_id" })
    chats: Chat;

    @ManyToOne(() => User, user => user.userChat)
    @JoinColumn({ name: "user_id" })
    users: User;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at: Date;
}
