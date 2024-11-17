import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export enum DatabaseDialect {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  SQLITE = 'sqlite',
  MARIADB = 'mariadb',
  ORACLE = 'oracle',
  MSSQL = 'mssql',
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Retrieve dialect as a string and check against allowed values
        const dbDialect = configService.get<string>('DB_DIALECT');
        const validDialects = ['postgres', 'mysql', 'sqlite', 'mariadb', 'oracle', 'mssql'] as const; // Type assertion to match TypeORM valid types

        // Ensure type compatibility with TypeORM options
        if (!validDialects.includes(dbDialect as (typeof validDialects)[number])) {
          throw new Error(`Invalid database dialect: ${dbDialect}`);
        }

        const dbConfig = {
          type: dbDialect as (typeof validDialects)[number], // Type assertion ensures correct string value
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true, // Disable in production
          logging: true,
        };
        return dbConfig;
      },
    }),
  ],
})
export class DatabaseModule {}
