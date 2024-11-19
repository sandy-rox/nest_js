import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Put,
  Logger,
  Req,
} from '@nestjs/common';
import { Roles } from '../auth/decorator/roles.decorator'; // Roles decorator
import { RolesGuard } from '../auth/guard/role.guard'; // Roles guard to enforce role-based access
import { DocumentService } from './document.service'; // Service for document-related operations
import { FileInterceptor } from '@nestjs/platform-express'; // Multer file upload handling
import { diskStorage } from 'multer'; // Multer disk storage configuration
import { CreateDocumentDto } from './dto/create-document.dto'; // DTO for document creation
import { User } from '../users/entities/user.entity'; // User entity for user-related operations

@Controller({ path: 'documents', version: '1' })
@UseGuards(RolesGuard) // Guard to enforce role-based access
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name); // Logger for the controller

  constructor(private readonly documentService: DocumentService) {}

  /**
   * Endpoint to upload a document.
   * The document is stored and a corresponding database entry is created.
   * @param createDocumentDto - DTO with document metadata
   * @param file - The uploaded file
   * @param req - Request object containing user information
   * @returns The result of document creation
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Path where files will be stored
        filename: (req, file, cb) => {
          const sanitizedFilename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          cb(null, sanitizedFilename);
        },
      }),
    }),
  )
  async uploadDocument(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    this.logger.log('Received request to upload document');

    // Check if the file is correctly received
    if (!file) {
      this.logger.error('File upload failed: No file received');
      throw new Error('File upload failed');
    }
    this.logger.log(`File received: ${file.originalname}`);

    // Log the createDocumentDto for debugging
    this.logger.debug(`Received DTO: ${JSON.stringify(createDocumentDto)}`);

    // Extract user from request (assuming it is populated by an authentication middleware/guard)
    const user: User = req['user'];
    if (!user) {
      this.logger.warn('No user information found in request');
    } else {
      this.logger.log(`User found: ${JSON.stringify(user)}`);
    }

    try {
      this.logger.log('Attempting to create a document entry in the service');
      const result = await this.documentService.create(createDocumentDto, file, user);
      this.logger.log('Document successfully created');
      return result;
    } catch (error) {
      this.logger.error('Error while creating document:', error);
      throw error;
    }
  }

  /**
   * Endpoint to get all documents for the authenticated user.
   * @param req - Request object containing user information
   * @returns A list of all documents associated with the user
   */
  @Get()
  @Roles('viewer', 'editor', 'admin') // Only accessible by users with these roles
  async findAll(@Request() req) {
    const user: User = req.user;
    return this.documentService.findAll(user);
  }

  /**
   * Endpoint to get a specific document by ID.
   * @param id - The document ID
   * @param req - Request object containing user information
   * @returns The document associated with the given ID
   */
  @Get(':id')
  @Roles('viewer', 'editor', 'admin') // Only accessible by users with these roles
  async findOne(@Param('id') id: number, @Request() req) {
    const user: User = req.user;
    return this.documentService.findOne(id, user);
  }

  /**
   * Endpoint to delete a specific document by ID.
   * @param id - The document ID
   * @param req - Request object containing user information
   * @returns A success message or error if the document cannot be deleted
   */
  @Delete(':id')
  @Roles('viewer', 'editor', 'admin') // Only accessible by users with these roles
  async remove(@Param('id') id: number, @Request() req) {
    const user: User = req.user;
    return this.documentService.remove(id, user);
  }

  /**
   * Endpoint to update a document by ID.
   * @param id - The document ID
   * @param updateDocumentDto - DTO with updated document information
   * @param req - Request object containing user information
   * @returns The updated document
   */
  @Put(':id')
  @Roles('viewer', 'editor', 'admin') // Only accessible by users with these roles
  async update(@Param('id') id: number, @Body() updateDocumentDto: CreateDocumentDto, @Request() req) {
    const user: User = req.user;
    return this.documentService.update(id, updateDocumentDto, user);
  }
}
