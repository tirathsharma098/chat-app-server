import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import User from "./User.entity";

@Entity("tokens")
export default class Token {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: true })
    user_ip: string;

    @ManyToOne(() => User, (user) => user.userToken)
    @JoinColumn({ name: "user" })
    userCreatedToken: User;

    @Column({ type: "varchar", length: 500, nullable: false, unique: true })
    token: string;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at: Date;

    @Column()
    valid_till: string;
}
