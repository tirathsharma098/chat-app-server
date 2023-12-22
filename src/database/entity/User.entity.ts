import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Chat from "./Chat.entity";
import Message from "./Message.entity";
import Token from "./Token.entity";
import UserChat from "./UserChat.entity";
import ReadBy from "./UserReadby.entity";

@Entity("users")
export default class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 100 })
    full_name: string;

    @Column({ unique: true, length: 25, nullable: false })
    username: string;

    @Column({ length: 500, nullable: false })
    password: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ unique: true, nullable: true })
    mobile: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    last_login: Date;

    @OneToMany(() => UserChat, chat => chat.users)
    userChat: UserChat[];

    @OneToMany(() => Chat, chat => chat.groupAdminUser)
    groupAdminChat: Chat[];

    @OneToMany(() => Message, message => message.messageSender)
    messageSender: Message[];

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at: Date;

    @OneToMany(() => Token, token => token.userCreatedToken)
    userToken: Token[];

    @OneToMany(() => ReadBy, readby => readby.userReadby)
    readybyUser: ReadBy[];
}
