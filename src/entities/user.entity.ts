import { Entity, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { BaseWithCreatedEntityInfo } from './base.created.entity';
import { Project } from './project.entity';
import { Role } from './role.entity';
import { File } from './file.entity';
import { TestCase } from './testCase.entity';

@Entity()
export class User extends BaseWithCreatedEntityInfo {
    @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'user_id' })
    id: number;
    @Column({ name: 'full_name', nullable: true })
    fullName: string;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string;
    @Column({ name: 'phone_number', nullable: true })
    phoneNumber?: string;
    @Column({ name: 'day_of_birth', nullable: true })
    dayOfBirth?: Date;
    @Column({ name: 'refresh_token', nullable: true })
    refreshToken?: string;
    @OneToMany(() => Role, role => role.createdBy)
    @JoinColumn({
        name: 'roles'
    })
    roles: Role[];
    @ManyToOne(() => Role, role => role.id)
    @JoinColumn({ name: 'role' })
    role: Role;

    @OneToOne(() => File, file => file.id)
    @JoinColumn({ name: 'avatar' })
    avatar: File;

    @OneToMany(() => File, file => file.id)
    @JoinColumn({ name: 'avatar' })
    avatars: File[];

    @OneToOne(() => File, file => file.id)
    @JoinColumn({ name: 'banner' })
    banner: File;

    @OneToMany(() => File, file => file.id)
    @JoinColumn({ name: 'banners' })
    banners: File[];

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
    @OneToMany(() => User, user => user.createdBy)
    @JoinColumn({
        name: 'createdByIds'
    })
    createdByIds: User[];
    @OneToMany(() => User, user => user.updatedBy)
    @JoinColumn({
        name: 'updatedByIds'
    })
    updatedByIds: User[];
}
