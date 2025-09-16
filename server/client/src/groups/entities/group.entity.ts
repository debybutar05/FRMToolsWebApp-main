import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EntityEntity } from '../../entities/entity.entity

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  groupId: number;

  @Column()
  groupName: string;

  @OneToMany(() => EntityEntity, entity => entity.group)
  entities: EntityEntity[];
}
