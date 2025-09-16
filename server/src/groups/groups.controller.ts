import { Controller, Get } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Group } from './entities/group.entity';

@Controller('api/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  findAll(): Promise<Group[]> {
    return this.groupsService.findAll();
  }
}
