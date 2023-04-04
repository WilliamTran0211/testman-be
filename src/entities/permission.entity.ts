import { Entity, JoinTable, ManyToMany } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { BaseWithCreatedEntityInfo } from './base.created.entity';
import { Role } from './role.entity';
@Entity()
export class Permission extends BaseWithCreatedEntityInfo {
    @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'permission_id' })
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    resource: string;
    @ManyToMany(() => Role, role => role.permissions)
    @JoinTable({ name: 'roles_permissions' })
    roles: Role[];
}
