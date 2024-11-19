"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederCommand = void 0;
const nestjs_console_1 = require("nestjs-console");
const common_1 = require("@nestjs/common");
class SeederCommand {
    constructor(seederService) {
        this.seederService = seederService;
        this.logger = new common_1.Logger(SeederCommand.name);
    }
    async run() {
        try {
            this.logger.log('Seeding process started...');
            await this.seederService.seed();
            this.logger.log('Database seeding complete!');
        }
        catch (error) {
            this.logger.error('Error during seeding process', error.stack);
        }
    }
}
exports.SeederCommand = SeederCommand;
__decorate([
    (0, nestjs_console_1.Command)({
        command: 'seed',
        description: 'Seeds the database with initial data',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeederCommand.prototype, "run", null);
//# sourceMappingURL=seeder.command.js.map