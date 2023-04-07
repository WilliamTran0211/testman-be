import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseWithCreatedEntityInfo } from './base.created.entity';

@Entity()
export class File extends BaseWithCreatedEntityInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;
}
