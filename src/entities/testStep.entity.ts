import { Entity } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { BaseWithCreatedEntityInfo } from './base.created.entity';

@Entity()
export class TestStep extends BaseWithCreatedEntityInfo {
    @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'test_step_id' })
    id: number;
    @Column()
    name: string;
    @Column({ nullable: true })
    description: string;
    @Column()
    content: string;
    @Column({ default: 1 })
    order: number;
}
