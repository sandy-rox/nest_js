"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const token_module_1 = require("../token/token.module");
const users_module_1 = require("../users/users.module");
const token_service_1 = require("../token/token.service");
const users_service_1 = require("../users/users.service");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../token/entities/token.entity");
const user_entity_1 = require("../users/entities/user.entity");
const role_entity_1 = require("../users/entities/role.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([token_entity_1.Token, user_entity_1.User, role_entity_1.Role]), users_module_1.UserModule, token_module_1.TokenModule],
        providers: [auth_service_1.AuthService, token_service_1.TokenService, users_service_1.UserService],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService, token_service_1.TokenService, users_service_1.UserService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map