import { Command } from 'nestjs-console';
import { SeederService } from './seeder.service';

export class SeederCommand {
  constructor(private readonly seederService: SeederService) {}

  @Command({
    command: 'seed',
    description: 'Seeds the database with initial data',
  })
  async run() {
    await this.seederService.seed();
    console.log('Database seeding complete!');
  }
}
