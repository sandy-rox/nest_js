"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const dbDialect = configService.get('DB_DIALECT');
                    const validDialects = ['postgres', 'mysql', 'sqlite', 'mariadb', 'oracle', 'mssql'];
                    if (!validDialects.includes(dbDialect)) {
                        throw new Error(`Invalid database dialect: ${dbDialect}`);
                    }
                    const dbConfig = {
                        type: dbDialect,
                        host: configService.get('DB_HOST'),
                        port: configService.get('DB_PORT'),
                        username: configService.get('DB_USER'),
                        password: configService.get('DB_PASS'),
                        database: configService.get('DB_NAME'),
                        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                        synchronize: true,
                        logging: true,
                    };
                    return dbConfig;
                },
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map