import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityEntity } from './entity.entity';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EntityEntity])],
  providers: [EntitiesService],
  controllers: [EntitiesController],
  exports: [EntitiesService],
})
export class EntitiesModule {}
