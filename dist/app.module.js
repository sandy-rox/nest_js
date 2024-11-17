"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const config_1 = require("@nestjs/config");
const app_service_1 = require("./app.service");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const auth_middleware_1 = require("./modules/auth/middleware/auth.middleware");
const core_1 = require("@nestjs/core");
const role_guard_1 = require("./modules/auth/guard/role.guard");
const database_module_1 = require("./database/database.module");
const seeder_module_1 = require("./modules/seeder/seeder.module");
const request_log_middleware_1 = require("./common/middlewares/request-log.middleware");
const document_module_1 = require("./modules/document/document.module");
const ingestion_module_1 = require("./modules/ingestion/ingestion.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_log_middleware_1.RequestLogMiddleware).forRoutes('*');
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            database_module_1.DatabaseModule,
            users_module_1.UserModule,
            auth_module_1.AuthModule,
            seeder_module_1.SeederModule,
            document_module_1.DocumentModule,
            ingestion_module_1.IngestionModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: role_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map