"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var IngestionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionService = void 0;
const common_1 = require("@nestjs/common");
let IngestionService = IngestionService_1 = class IngestionService {
    constructor() {
        this.logger = new common_1.Logger(IngestionService_1.name);
    }
    async triggerIngestion(fileId, user) {
        this.logger.log(`Ingestion triggered for fileId: ${fileId} by userId: ${user.id}`);
        return {
            message: `Ingestion triggered successfully for file ${fileId}`,
            userId: user.id,
        };
    }
    async getIngestionStatus(ingestionId, user) {
        this.logger.log(`Fetching status for ingestionId: ${ingestionId} by userId: ${user.id}`);
        const status = 'In Progress';
        return {
            status,
            ingestionId,
            userId: user.id,
        };
    }
    async cancelIngestion(ingestionId, user) {
        this.logger.log(`Canceling ingestionId: ${ingestionId} by userId: ${user.id}`);
        return {
            message: `Ingestion canceled for ingestionId: ${ingestionId}`,
            ingestionId,
            userId: user.id,
        };
    }
};
exports.IngestionService = IngestionService;
exports.IngestionService = IngestionService = IngestionService_1 = __decorate([
    (0, common_1.Injectable)()
], IngestionService);
//# sourceMappingURL=ingestion.service.js.map