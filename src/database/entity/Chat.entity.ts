import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import User from "./User.entity";
import Message from "./Message.entity";
import UserChat from "./UserChat.entity";

@Entity("chats")
export default class Chat {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 100, nullable: true })
    chat_name: string;

    @Column({ type: "boolean", default: false })
    is_group_chat: string;

    @OneToMany(() => UserChat, chat => chat.chats)
    userChat: UserChat[];

    @OneToOne(() => Message, latest => latest.latestChat, { nullable: true })
    @JoinColumn({ name: "latest_chat_id" })
    latestMessage: Message;

    @ManyToOne(() => User, user => user.groupAdminChat, { nullable: true })
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

    @OneToMany(() => Message, message => message.userChat)
    chatMessage: Message[];
}
