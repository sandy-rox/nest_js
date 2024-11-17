import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './/entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { User } from '../users/entities/user.entity'; // Assuming User entity exists

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  // Admin can add any document, Editor and Viewer can add their own documents
  async create(createDocumentDto: CreateDocumentDto, file: Express.Multer.File, user: User): Promise<Document> {
    const document = this.documentRepository.create({
      name: createDocumentDto.name,
      path: file.path,
      uploadedAt: new Date(),
      user: user, // Associate the document with the logged-in user
    });
    return this.documentRepository.save(document);
  }

  async findAll(user: User): Promise<Document[]> {
    if (user.roles && user.roles.some((role) => role.name === 'viewer')) {
      console.log(user);
      return this.documentRepository.find({ where: { user: { id: user.id } } }); // Viewer can only view their own documents
    }
    return this.documentRepository.find(); // Admin and Editor can view all documents
  }

  async findOne(id: number, user: User): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id }, relations: ['user'] });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Viewer can only view their own documents
    if (user.roles && user.roles.some((role) => role.name === 'viewer') && document.user.id !== user.id) {
      throw new ForbiddenException('You are not authorized to view this document');
    }

    return document;
  }

  // Admin can update any document, Editor can update only their own document
  async update(id: number, updateDocumentDto: CreateDocumentDto, user: User): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id }, relations: ['user'] });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (user.roles && user.roles.some((role) => role.name === 'viewer') && document.user.id !== user.id) {
      throw new ForbiddenException('You are not authorized to update this document');
    }

    document.name = updateDocumentDto.name || document.name;
    document.uploadedAt = new Date(); // Set updated timestamp

    return this.documentRepository.save(document);
  }

  // Admin can delete any document, Editor can only delete their own document, Viewer cannot delete
  async remove(id: number, user: User): Promise<void> {
    const document = await this.documentRepository.findOne({ where: { id }, relations: ['user'] });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Admin can delete any document
    if (user.roles && user.roles.some((role) => role.name === 'admin')) {
      await this.documentRepository.delete(id);
      return;
    }

    // Editor can delete only their own document
    if (user.roles && user.roles.some((role) => role.name === 'editor') && document.user.id === user.id) {
      await this.documentRepository.delete(id);
      return;
    }

    // Viewer cannot delete any document
    if (user.roles && user.roles.some((role) => role.name === 'viewer')) {
      throw new ForbiddenException('You are not authorized to delete documents');
    }

    // If none of the above conditions are met, forbid deletion
    throw new ForbiddenException('You are not authorized to delete this document');
  }
}
