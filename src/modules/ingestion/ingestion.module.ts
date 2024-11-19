import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { RolesGuard } from '../auth/guard/role.guard'; // Import the role guard
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [], // Add any necessary modules here (e.g., Database, Auth)
  controllers: [IngestionController],
  providers: [
    IngestionService,
    {
      provide: APP_GUARD, // Apply the RolesGuard globally
      useClass: RolesGuard,
    },
  ],
})
export class IngestionModule {}
