import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity'; // Document entity
import { RolesGuard } from '../auth/guard/role.guard'; // Role guard to enforce RBAC
import { User } from '../users/entities/user.entity'; // User entity for relationship with documents
import { Token } from '../token/entities/token.entity'; // Token entity if needed for authorization or other purposes

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, User, Token]), // Importing the necessary entities for interaction with DB
  ],
  controllers: [DocumentController], // Register the controller that will handle document-related HTTP requests
  providers: [
    DocumentService, // The service containing business logic for document handling
    RolesGuard, // The guard that enforces role-based access control
  ],
})
export class DocumentModule {}
