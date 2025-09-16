import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsModule } from './groups/groups.module';
import { Group } from './groups/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',        // ganti sesuai host PostgreSQL-mu
      port: 5432,
      username: 'postgres',          // username DB
      password: 'debi7777',   // password DB
      database: 'frmtools',     // nama database
      entities: [Group],
      synchronize: true,        // jangan pakai di production
    }),
    GroupsModule,
  ],
})
export class AppModule {}
