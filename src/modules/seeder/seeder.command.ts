import { Command } from 'nestjs-console';
import { SeederService } from './seeder.service';
import { Logger } from '@nestjs/common';

export class SeederCommand {
  private readonly logger = new Logger(SeederCommand.name);

  constructor(private readonly seederService: SeederService) {}

  @Command({
    command: 'seed',
    description: 'Seeds the database with initial data',
  })
  async run() {
    try {
      this.logger.log('Seeding process started...');
      await this.seederService.seed();
      this.logger.log('Database seeding complete!');
    } catch (error) {
      this.logger.error('Error during seeding process', error.stack);
    }
  }
}
