import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EntityItem } from '../../entities/entities/entity.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn({ name: 'groupid' })
  id: number;

  @Column({ name: 'groupname' })
  name: string;

  @OneToMany(() => EntityItem, entity => entity.group)
  entities: EntityItem[];
}
