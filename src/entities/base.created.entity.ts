import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityInfo } from './base.entity';
import { User } from './user.entity';

@Entity()
export class BaseWithCreatedEntityInfo extends BaseEntityInfo {
    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    createdBy?: User;
    @ManyToOne(() => User)
    @JoinColumn({ name: 'updated_by' })
    updatedBy?: User;
}
