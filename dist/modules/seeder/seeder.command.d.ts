import { SeederService } from './seeder.service';
export declare class SeederCommand {
    private readonly seederService;
    private readonly logger;
    constructor(seederService: SeederService);
    run(): Promise<void>;
}
