import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Group } from '../groups/entities/group.entity'; // pastikan path benar

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres', 
  password: 'debi7777', 
  database: 'frmtools',
  entities: [Group],      
  synchronize: false,      
};
