"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionModule = void 0;
const common_1 = require("@nestjs/common");
const ingestion_controller_1 = require("./ingestion.controller");
const ingestion_service_1 = require("./ingestion.service");
const role_guard_1 = require("../auth/guard/role.guard");
const core_1 = require("@nestjs/core");
let IngestionModule = class IngestionModule {
};
exports.IngestionModule = IngestionModule;
exports.IngestionModule = IngestionModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [ingestion_controller_1.IngestionController],
        providers: [
            ingestion_service_1.IngestionService,
            {
                provide: core_1.APP_GUARD,
                useClass: role_guard_1.RolesGuard,
            },
        ],
    })
], IngestionModule);
//# sourceMappingURL=ingestion.module.js.map