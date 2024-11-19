import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { User } from '../users/entities/user.entity';

describe('IngestionService', () => {
  let service: IngestionService;

  const mockUser: User = { id: 1 } as User; // Mock user object with a sample ID

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngestionService],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
  });

  describe('triggerIngestion', () => {
    it('should return a success message when ingestion is triggered', async () => {
      const fileId = 123;
      const result = await service.triggerIngestion(fileId, mockUser);

      expect(result).toEqual({
        message: `Ingestion triggered successfully for file ${fileId}`,
        userId: mockUser.id,
      });
    });
  });

  describe('getIngestionStatus', () => {
    it('should return the status of an ingestion job', async () => {
      const ingestionId = 'ing123';
      const result = await service.getIngestionStatus(ingestionId, mockUser);

      expect(result).toEqual({
        status: 'In Progress',
        ingestionId,
        userId: mockUser.id,
      });
    });
  });

  describe('cancelIngestion', () => {
    it('should return a success message when an ingestion job is canceled', async () => {
      const ingestionId = 'ing456';
      const result = await service.cancelIngestion(ingestionId, mockUser);

      expect(result).toEqual({
        message: `Ingestion canceled for ingestionId: ${ingestionId}`,
        ingestionId,
        userId: mockUser.id,
      });
    });
  });
});
