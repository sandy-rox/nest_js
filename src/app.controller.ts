import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Basic endpoint to fetch a message
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Another endpoint for custom functionality (for example)
  @Get('status')
  getStatus(): string {
    return 'The application is running!';
  }
}
