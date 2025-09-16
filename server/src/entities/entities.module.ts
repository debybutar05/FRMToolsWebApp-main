import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';
import { EntityItem } from './entities/entity.entity';
import { Group } from '../groups/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EntityItem, Group]), // tambahkan Group di sini
  ],
  providers: [EntitiesService],
  controllers: [EntitiesController],
})
export class EntitiesModule {}
