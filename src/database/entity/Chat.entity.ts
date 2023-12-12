import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import User from "./User.entity";
import Message from "./Message.entity";

@Entity("chats")
export default class Chat {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false, length: 100})
    chat_name: string;

    @Column({type: 'boolean', nullable: false })
    is_group_chat: string;

    @ManyToOne(() => User, (user) => user.userChat)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Message, (message) => message.userChat)
    @JoinColumn({ name: "message_id" })
    chatMessage: Message;

    @ManyToOne(() => User, (user) => user.groupAdminChat)
    @JoinColumn({ name: "admin_id" })
    groupAdminUser: User;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at: Date;
}
