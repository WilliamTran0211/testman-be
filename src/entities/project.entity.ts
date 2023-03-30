import { Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { BaseWithCreatedEntityInfo } from './base.created.entity';
import { State } from './state.entity';
import { User } from './user.entity';

@Entity()
export class Project extends BaseWithCreatedEntityInfo {
    @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'project_id' })
    id: number;
    @Column()
    name: string;
    @Column({ nullable: true })
    description: string;
    @Column()
    estimate: string;
    @ManyToOne(() => State, state => state.id)
    @JoinColumn({
        name: 'state'
    })
    state: State;
    @ManyToMany(() => User, user => user.id)
    @JoinColumn({
        name: 'members'
    })
    members: User[];
}
