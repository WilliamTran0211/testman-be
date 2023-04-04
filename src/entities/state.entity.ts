import { Entity, JoinColumn, OneToMany } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { BaseWithCreatedEntityInfo } from './base.created.entity';
import { Project } from './project.entity';
import { TestCase } from './testCase.entity';

@Entity()
//export class State extends BaseWithCreatedEntityInfo
export class State {
    @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'state_id' })
    id: number;
    @Column()
    name: string;
    @Column({ nullable: true })
    description: string;
    @Column()
    estimate: string;
    @OneToMany(() => Project, project => project.id)
    @JoinColumn()
    projects: Project[];
    @OneToMany(() => TestCase, testCase => testCase.id)
    @JoinColumn()
    testCases: TestCase[];
}
