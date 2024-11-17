import { SeederService } from './seeder.service';
export declare class SeederCommand {
    private readonly seederService;
    constructor(seederService: SeederService);
    run(): Promise<void>;
}
