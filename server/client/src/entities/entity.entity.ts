import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Group } from '../../groups/entities/group.entity';

@Entity('entities')
export class EntityEntity {
  @PrimaryGeneratedColumn()
  entityId: number;

  @Column()
  entityName: string;

  @ManyToOne(() => Group, (group) => group.entities)
  @JoinColumn({ name: 'groupid' })
  group: Group;
}
