import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from '../config/database.config';

export const DatabaseModule = SequelizeModule.forRootAsync({
  useFactory: () => databaseConfig(),
});
