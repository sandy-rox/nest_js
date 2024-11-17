import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity'; // Assuming Document entity is defined here
import { RolesGuard } from '../auth/guard/role.guard'; // The role guard to enforce access control
import { User } from '../users/entities/user.entity'; // Assuming User entity is defined here
import { Token } from '../token/entities/token.entity'; // Assuming Token entity is defined here

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, User, Token]), // Import the entities related to documents
  ],
  controllers: [DocumentController], // Register the controller that handles HTTP requests for documents
  providers: [
    DocumentService, // The service that contains the business logic for documents
    RolesGuard, // The guard to enforce role-based access control
  ],
})
export class DocumentModule {}
