import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Permission } from './permission.entity';
import { User } from './user.entity';
import { BaseWithCreatedEntityInfo } from './base.created.entity';

@Entity()
export class Role extends BaseWithCreatedEntityInfo {
    @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'role_id' })
    id: number;
    @Column()
    name: string;
    @Column({ nullable: true })
    description: string;
    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'roles_permissions'
    })
    permissions: Permission[];
    @ManyToOne(() => User, user => user.roles)
    @JoinColumn({ name: 'created_by' })
    createdBy: User;
}
