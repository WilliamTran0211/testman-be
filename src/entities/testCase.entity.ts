import {
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Project } from './project.entity';
import { State } from './state.entity';
import { User } from './user.entity';

@Entity()
//export class TestCase extends BaseWithCreatedEntityInfo
export class TestCase {
    @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'test_case_id' })
    id: number;
    @Column()
    name: string;
    @Column({ nullable: true })
    description: string;
    @Column()
    estimate: string;
    @Column()
    expectResult: string;
    @Column({ nullable: true })
    outcome: boolean;
    @ManyToMany(() => User, user => user.testCases)
    @JoinTable({
        name: 'user_test_case'
    })
    assignees: User[];
    @OneToMany(() => User, user => user.id)
    @JoinColumn()
    assigner: User;
    @ManyToOne(() => Project, project => project.id)
    @JoinColumn()
    project: Project;
    @ManyToOne(() => State, state => state.testCases)
    @JoinColumn()
    state: State;
}
