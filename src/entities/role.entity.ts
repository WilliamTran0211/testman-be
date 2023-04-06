import { Entity, JoinTable, ManyToMany } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { BaseWithCreatedEntityInfo } from './base.created.entity';
import { Permission } from './permission.entity';

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
}
