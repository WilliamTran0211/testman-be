import { Entity } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { BaseWithCreatedEntityInfo } from './base.created.entity';

@Entity()
export class TestData extends BaseWithCreatedEntityInfo {
    @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'test_data_id' })
    id: number;
    @Column()
    name: string;
    @Column({ nullable: true })
    description: string;
    @Column()
    value: string;
}
