import { Entity } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { BaseWithCreatedEntityInfo } from './base.created.entity';
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
}
