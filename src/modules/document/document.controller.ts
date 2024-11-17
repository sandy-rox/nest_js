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
import { Roles } from '../auth/decorator/roles.decorator'; // Assuming you have this in the auth folder
import { RolesGuard } from '../auth/guard/role.guard'; // Import the role guard
import { DocumentService } from './document.service'; // Assuming you have a document service
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateDocumentDto } from './dto/create-document.dto';
import { User } from 'src/modules/users/entities/user.entity';

@Controller({ path: 'documents', version: '1' })
@UseGuards(RolesGuard)
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
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

  @Get()
  @Roles('viewer', 'editor', 'admin')
  async findAll(@Request() req) {
    const user: User = req.user;
    return this.documentService.findAll(user);
  }

  @Get(':id')
  @Roles('viewer', 'editor', 'admin')
  async findOne(@Param('id') id: number, @Request() req) {
    const user: User = req.user;
    return this.documentService.findOne(id, user);
  }

  @Delete(':id')
  @Roles('viewer', 'editor', 'admin')
  async remove(@Param('id') id: number, @Request() req) {
    const user: User = req.user;
    return this.documentService.remove(id, user);
  }

  @Put(':id')
  @Roles('viewer', 'editor', 'admin')
  async update(@Param('id') id: number, @Body() updateDocumentDto: CreateDocumentDto, @Request() req) {
    const user: User = req.user;
    return this.documentService.update(id, updateDocumentDto, user);
  }
}
