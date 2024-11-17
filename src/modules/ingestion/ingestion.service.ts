import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class IngestionService {
  async triggerIngestion(fileId: number, user: User) {
    return { message: 'Ingestion triggered successfully for file ' + fileId, userId: user.id };
  }

  async getIngestionStatus(ingestionId: string, user: User) {
    return { status: 'In Progress', ingestionId, userId: user.id };
  }

  async cancelIngestion(ingestionId: string, user: User) {
    return { message: 'Ingestion canceled.', ingestionId, userId: user.id };
  }
}
