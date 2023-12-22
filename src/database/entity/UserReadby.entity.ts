import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import User from "./User.entity";
import Message from "./Message.entity";

@Entity("read_by")
export default class ReadBy {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Message, message => message.readbyMessage)
    @JoinColumn({ name: "message_readby_id" })
    messageReadby: Message;

    @ManyToOne(() => User, user => user.readybyUser)
    @JoinColumn({ name: "user_readby_id" })
    userReadby: User;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at: Date;
}
