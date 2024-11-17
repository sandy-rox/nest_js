import { Controller, Post, Get, Param, UseGuards, Req, Body } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { Roles } from '../auth/decorator/roles.decorator'; // Assuming you have this in the auth folder
import { RolesGuard } from '../auth/guard/role.guard'; // Import the role guard
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';

@Controller('ingestion')
@UseGuards(RolesGuard) // Apply guard at the controller level
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @Roles('viewer', 'editor', 'admin') // Both users and admins can trigger
  async triggerIngestion(@Body() triggerDto: TriggerIngestionDto, @Req() req) {
    const { fileId } = triggerDto;
    return this.ingestionService.triggerIngestion(fileId, req.user);
  }

  @Get(':id/status')
  @Roles('viewer', 'editor', 'admin') // Both users and admins can check status
  async getIngestionStatus(@Param('id') id: string, @Req() req) {
    return this.ingestionService.getIngestionStatus(id, req.user);
  }

  @Post(':id/cancel')
  @Roles('admin') // Only admins can cancel ingestion
  async cancelIngestion(@Param('id') id: string, @Req() req) {
    return this.ingestionService.cancelIngestion(id, req.user);
  }
}
