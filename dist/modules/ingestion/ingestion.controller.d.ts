import { IngestionService } from './ingestion.service';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';
export declare class IngestionController {
    private readonly ingestionService;
    constructor(ingestionService: IngestionService);
    triggerIngestion(triggerDto: TriggerIngestionDto, req: any): Promise<{
        message: string;
        userId: number;
    }>;
    getIngestionStatus(id: string, req: any): Promise<{
        status: string;
        ingestionId: string;
        userId: number;
    }>;
    cancelIngestion(id: string, req: any): Promise<{
        message: string;
        ingestionId: string;
        userId: number;
    }>;
}
