import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { RolesGuard } from '../auth/guard/role.guard';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';

describe('IngestionController', () => {
  let controller: IngestionController;
  let ingestionService: IngestionService;

  const mockIngestionService = {
    triggerIngestion: jest.fn().mockImplementation((fileId, user) => ({
      message: `Ingestion triggered successfully for file ${fileId}`,
      userId: user.id,
    })),
    getIngestionStatus: jest.fn().mockImplementation((id, user) => ({
      status: 'In Progress',
      ingestionId: id,
      userId: user.id,
    })),
    cancelIngestion: jest.fn().mockImplementation((id, user) => ({
      message: `Ingestion canceled for ingestionId: ${id}`,
      ingestionId: id,
      userId: user.id,
    })),
  };

  const mockUser = { id: 1, roles: ['admin'] }; // Sample mock user

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [{ provide: IngestionService, useValue: mockIngestionService }],
    })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true), // Mock the guard to always allow
      })
      .compile();

    controller = module.get<IngestionController>(IngestionController);
    ingestionService = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('triggerIngestion', () => {
    it('should trigger ingestion successfully', async () => {
      const triggerDto: TriggerIngestionDto = { fileId: 123 };
      const req = { user: mockUser };

      const result = await controller.triggerIngestion(triggerDto, req);

      expect(ingestionService.triggerIngestion).toHaveBeenCalledWith(123, mockUser);
      expect(result).toEqual({
        message: 'Ingestion triggered successfully for file 123',
        userId: mockUser.id,
      });
    });
  });

  describe('getIngestionStatus', () => {
    it('should return ingestion status', async () => {
      const req = { user: mockUser };
      const result = await controller.getIngestionStatus('ing123', req);

      expect(ingestionService.getIngestionStatus).toHaveBeenCalledWith('ing123', mockUser);
      expect(result).toEqual({
        status: 'In Progress',
        ingestionId: 'ing123',
        userId: mockUser.id,
      });
    });
  });

  describe('cancelIngestion', () => {
    it('should cancel ingestion successfully', async () => {
      const req = { user: mockUser };
      const result = await controller.cancelIngestion('ing456', req);

      expect(ingestionService.cancelIngestion).toHaveBeenCalledWith('ing456', mockUser);
      expect(result).toEqual({
        message: 'Ingestion canceled for ingestionId: ing456',
        ingestionId: 'ing456',
        userId: mockUser.id,
      });
    });
  });
});
