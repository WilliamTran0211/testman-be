import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { BaseWithCreatedEntityInfo } from './base.created.entity';
import { User } from './user.entity';

@Entity()
export class File extends BaseWithCreatedEntityInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(() => User, (user: User) => user.avatars)
    @JoinColumn({ name: 'user' })
    user: User;
}
