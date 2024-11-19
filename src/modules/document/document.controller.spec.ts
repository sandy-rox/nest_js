/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { RolesGuard } from '../auth/guard/role.guard';
import { CreateDocumentDto } from './dto/create-document.dto';
import { User } from '../users/entities/user.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { diskStorage } from 'multer';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  const mockDocumentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  const mockUser: User = { id: 1, roles: [{ name: 'editor' }] } as User;
  const mockCreateDocumentDto: CreateDocumentDto = {
    name: 'Test Document',
    path: '',
  };
  const mockFile = {
    path: '/uploads/test-file.txt',
    originalname: 'test-file.txt',
  } as Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocumentService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadDocument', () => {
    it('should upload a document and return the created document', async () => {
      const mockResponse = { id: 1, ...mockCreateDocumentDto, path: mockFile.path };
      mockDocumentService.create.mockResolvedValue(mockResponse);

      const result = await controller.uploadDocument(mockCreateDocumentDto, mockFile, { user: mockUser } as any);

      expect(mockDocumentService.create).toHaveBeenCalledWith(mockCreateDocumentDto, mockFile, mockUser);
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if no file is uploaded', async () => {
      await expect(controller.uploadDocument(mockCreateDocumentDto, null, { user: mockUser } as any)).rejects.toThrow(
        'File upload failed',
      );
    });
  });

  describe('findAll', () => {
    it('should return all documents for the user', async () => {
      const mockDocuments = [
        { id: 1, name: 'Document 1' },
        { id: 2, name: 'Document 2' },
      ];
      mockDocumentService.findAll.mockResolvedValue(mockDocuments);

      const result = await controller.findAll({ user: mockUser } as any);

      expect(mockDocumentService.findAll).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockDocuments);
    });
  });

  describe('findOne', () => {
    it('should return a specific document by id', async () => {
      const mockDocument = { id: 1, name: 'Test Document' };
      mockDocumentService.findOne.mockResolvedValue(mockDocument);

      const result = await controller.findOne(1, { user: mockUser } as any);

      expect(mockDocumentService.findOne).toHaveBeenCalledWith(1, mockUser);
      expect(result).toEqual(mockDocument);
    });
  });

  describe('remove', () => {
    it('should delete a document and return a success message', async () => {
      mockDocumentService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1, { user: mockUser } as any);

      expect(mockDocumentService.remove).toHaveBeenCalledWith(1, mockUser);
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a document and return the updated document', async () => {
      const mockUpdatedDocument = { id: 1, name: 'Updated Document' };
      mockDocumentService.update.mockResolvedValue(mockUpdatedDocument);

      const result = await controller.update(
        1,
        {
          name: 'Updated Document',
          path: '',
        },
        { user: mockUser } as any,
      );

      expect(mockDocumentService.update).toHaveBeenCalledWith(1, { name: 'Updated Document', path: '' }, mockUser);
      expect(result).toEqual(mockUpdatedDocument);
    });
  });
});
