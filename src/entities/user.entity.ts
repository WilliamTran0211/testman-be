import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { BaseEntityInfo } from './base.entity';
import { Project } from './project.entity';
import { Role } from './role.entity';
import { TestCase } from './testCase.entity';

@Entity()
export class User extends BaseEntityInfo {
    @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'user_id' })
    id: number;
    @Column({ name: 'full_name', nullable: true })
    fullName: string;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string;
    @Column({ name: 'phone_number', nullable: true })
    phoneNumber: string;
    @Column({ name: 'day_of_birth', nullable: true })
    dayOfBirth: Date;
    @Column({ name: 'refresh_token', nullable: true })
    refreshToken: string;
    @OneToMany(() => Role, role => role.createdBy)
    @JoinColumn({
        name: 'roles'
    })
    roles: Role[];
    @ManyToOne(() => Role, role => role.id)
    @JoinColumn()
    role: Role;
    @ManyToMany(() => Project, project => project.members)
    @JoinTable({
        name: 'project_member'
    })
    projects: Project[];
    @ManyToMany(() => TestCase, testCase => testCase.assignees)
    @JoinTable({
        name: 'user_test_case'
    })
    testCases: TestCase[];
}
