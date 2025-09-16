import { Controller, Get } from '@nestjs/common';
import { EntitiesService } from './entities.service';

@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  getAll() {
    return this.entitiesService.findAll();
  }
}
