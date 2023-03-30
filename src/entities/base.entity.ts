import { STATUS } from 'src/common/enums/status';
import { CreateDateColumn, Entity, UpdateDateColumn, Column } from 'typeorm';

@Entity()
export class BaseEntityInfo {
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'created_at'
    })
    createdAt: Date;
    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        name: 'updated_at'
    })
    updatedAt: Date;
    @Column({ default: STATUS.ACTIVATE })
    status: STATUS;
}
