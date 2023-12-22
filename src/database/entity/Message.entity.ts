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
import Chat from "./Chat.entity";
import ReadBy from "./UserReadby.entity";

@Entity("messages")
export default class Message {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.messageSender)
    @JoinColumn({ name: "sender_id" })
    messageSender: User;

    @Column({ type: "text", nullable: true })
    content: string;

    @ManyToOne(() => Chat, chat => chat.chatMessage)
    @JoinColumn({ name: "chat_id" })
    userChat: Chat;

    @OneToMany(() => ReadBy, readby => readby.messageReadby)
    readbyMessage: ReadBy[];

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at: Date;

    @OneToOne(() => Chat, chat => chat.latestMessage)
    latestChat: Chat;
}
