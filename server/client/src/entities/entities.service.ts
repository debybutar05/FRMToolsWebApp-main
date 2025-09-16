import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityEntity } from './entity.entity';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectRepository(EntityEntity)
    private readonly entityRepository: Repository<EntityEntity>,
  ) {}

  findAll(): Promise<EntityEntity[]> {
    return this.entityRepository.find({ relations: ['group'] });
  }
}
