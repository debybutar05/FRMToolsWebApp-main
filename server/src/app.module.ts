import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsModule } from './groups/groups.module';
import { EntitiesModule } from './entities/entities.module';
import { Group } from './groups/entities/group.entity';
import { EntityItem } from './entities/entities/entity.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'debi7777',
      database: 'frmtools',
      entities: [Group, EntityItem],
      synchronize: false,
    }),
    GroupsModule,
    EntitiesModule, // <-- pastikan ada ini
  ],
})
export class AppModule {}
