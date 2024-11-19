/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { User } from '../users/entities/user.entity';

describe('DocumentService', () => {
  let service: DocumentService;
  let repository: Repository<Document>;

  const mockDocumentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    repository = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a document', async () => {
      const createDocumentDto: CreateDocumentDto = {
        name: 'Test Document',
        path: '',
      };
      const file = { path: '/path/to/file' } as Express.Multer.File;
      const user = { id: 1 } as User;

      const mockDocument = { id: 1, ...createDocumentDto, path: file.path, user };

      mockDocumentRepository.create.mockReturnValue(mockDocument);
      mockDocumentRepository.save.mockResolvedValue(mockDocument);

      const result = await service.create(createDocumentDto, file, user);

      expect(mockDocumentRepository.create).toHaveBeenCalledWith({
        name: createDocumentDto.name,
        path: file.path,
        uploadedAt: expect.any(Date),
        user: user,
      });
      expect(mockDocumentRepository.save).toHaveBeenCalledWith(mockDocument);
      expect(result).toEqual(mockDocument);
    });
  });

  describe('findAll', () => {
    it('should return all documents for admin/editor', async () => {
      const user = { roles: [{ name: 'admin' }] } as User;
      const mockDocuments = [{ id: 1 }, { id: 2 }];

      mockDocumentRepository.find.mockResolvedValue(mockDocuments);

      const result = await service.findAll(user);

      expect(mockDocumentRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockDocuments);
    });

    it('should return user-specific documents for a viewer', async () => {
      const user = { id: 1, roles: [{ name: 'viewer' }] } as User;
      const mockDocuments = [{ id: 1, user: { id: 1 } }];

      mockDocumentRepository.find.mockResolvedValue(mockDocuments);

      const result = await service.findAll(user);

      expect(mockDocumentRepository.find).toHaveBeenCalledWith({ where: { user: { id: user.id } } });
      expect(result).toEqual(mockDocuments);
    });
  });

  describe('findOne', () => {
    it('should return a document if found and authorized', async () => {
      const user = { id: 1, roles: [{ name: 'viewer' }] } as User;
      const mockDocument = { id: 1, user: { id: 1 } };

      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);

      const result = await service.findOne(1, user);

      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['user'] });
      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if document not found', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(undefined);
      const user = { id: 1 } as User;

      await expect(service.findOne(1, user)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const user = { id: 2, roles: [{ name: 'viewer' }] } as User;
      const mockDocument = { id: 1, user: { id: 1 } };

      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);

      await expect(service.findOne(1, user)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a document if found and authorized', async () => {
      const user = { id: 1, roles: [{ name: 'editor' }] } as User;
      const updateDocumentDto = { name: 'Updated Document' } as CreateDocumentDto;
      const mockDocument = { id: 1, name: 'Old Name', user: { id: 1 }, path: '', uploadedAt: new Date() };

      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);
      mockDocumentRepository.save.mockResolvedValue({ ...mockDocument, ...updateDocumentDto, uploadedAt: new Date() });

      const result = await service.update(1, updateDocumentDto, user);

      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['user'] });
      expect(mockDocumentRepository.save).toHaveBeenCalledWith({
        ...mockDocument,
        name: updateDocumentDto.name,
        uploadedAt: expect.any(Date),
      });
      expect(result).toEqual({
        ...mockDocument,
        ...updateDocumentDto,
        uploadedAt: expect.any(Date), // Allow for dynamic dates
      });
    });

    it('should throw NotFoundException if document not found', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(undefined);
      const user = { id: 1 } as User;

      await expect(
        service.update(
          1,
          {
            name: 'New Name',
            path: '',
          },
          user,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a document if found and authorized as admin', async () => {
      const user = { roles: [{ name: 'admin' }] } as User;
      const mockDocument = { id: 1, user: { id: 1 } };

      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);

      await service.remove(1, user);

      expect(mockDocumentRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException if user is not authorized to delete', async () => {
      const user = { id: 2, roles: [{ name: 'viewer' }] } as User;
      const mockDocument = { id: 1, user: { id: 1 } };

      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);

      await expect(service.remove(1, user)).rejects.toThrow(ForbiddenException);
    });
  });
});
