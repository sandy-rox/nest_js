import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * DatabaseModule configures TypeORM for database access in a NestJS application.
 * It utilizes configuration values to determine the database type and connection properties.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // Importing ConfigModule to provide configuration values dynamically
      imports: [ConfigModule],
      // Injecting ConfigService to access environment variables or configuration values
      inject: [ConfigService],
      // Factory function to create TypeORM configuration dynamically
      useFactory: (configService: ConfigService) => {
        // Retrieve the database dialect from configuration
        const dbDialect = configService.get<string>('DB_DIALECT');

        // Define allowed database dialects for validation
        const validDialects = ['postgres', 'mysql', 'sqlite', 'mariadb', 'oracle', 'mssql'] as const;

        // Validate the provided database dialect against allowed values
        if (!validDialects.includes(dbDialect as (typeof validDialects)[number])) {
          throw new Error(`Invalid database dialect: ${dbDialect}`);
        }

        // Define the database configuration for TypeORM
        const dbConfig = {
          type: dbDialect as (typeof validDialects)[number], // Type assertion ensures a valid string value
          host: configService.get<string>('DB_HOST'), // Database host
          port: configService.get<number>('DB_PORT'), // Database port
          username: configService.get<string>('DB_USER'), // Database username
          password: configService.get<string>('DB_PASS'), // Database password
          database: configService.get<string>('DB_NAME'), // Database name
          entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Entity file paths
          synchronize: true, // Automatically synchronize the database schema; disable in production
          logging: true, // Enable query logging
        };

        return dbConfig; // Return the TypeORM configuration object
      },
    }),
  ],
})
export class DatabaseModule {}
