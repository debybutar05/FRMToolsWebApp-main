import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityItem } from './entities/entity.entity';
import { Group } from '../groups/entities/group.entity';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectRepository(EntityItem)
    private entityRepository: Repository<EntityItem>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async getEntitiesGroupedByGroup() {
    // Ambil semua groups beserta entitiesnya
    const groups = await this.groupRepository.find({
      relations: ['entities'], // pastikan relasi di Group ada
    });

    // Format data sesuai yang diinginkan
    return groups.map(group => ({
      id: group.id,
      name: group.name,
      ListOfEntities: group.entities.map(e => ({
        id: e.id,
        name: e.name,
      })),
    }));
  }
}
