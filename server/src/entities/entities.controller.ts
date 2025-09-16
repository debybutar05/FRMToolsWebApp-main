import { Controller, Get } from '@nestjs/common';
import { EntitiesService } from './entities.service';

@Controller('api/entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  async getAllGrouped() {
    return this.entitiesService.getEntitiesGroupedByGroup();
  }
}
