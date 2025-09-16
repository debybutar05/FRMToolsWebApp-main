import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Group } from '../../groups/entities/group.entity';

@Entity('entities')
export class EntityItem {
  @PrimaryGeneratedColumn({ name: 'entityid' })
  id: number;

  @Column({ name: 'entityname' })
  name: string;

  @ManyToOne(() => Group, group => group.entities)
  @JoinColumn({ name: 'groupid' })
  group: Group;
}
