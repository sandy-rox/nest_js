import { User } from 'src/modules/users/entities/user.entity';
export declare class IngestionService {
    private readonly logger;
    triggerIngestion(fileId: number, user: User): Promise<{
        message: string;
        userId: number;
    }>;
    getIngestionStatus(ingestionId: string, user: User): Promise<{
        status: string;
        ingestionId: string;
        userId: number;
    }>;
    cancelIngestion(ingestionId: string, user: User): Promise<{
        message: string;
        ingestionId: string;
        userId: number;
    }>;
}
