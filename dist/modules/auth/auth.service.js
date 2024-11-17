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
exports.AuthService = void 0;
const bcrypt = require("bcryptjs");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const token_service_1 = require("../token/token.service");
let AuthService = class AuthService {
    constructor(userService, tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }
    async register(registerUserDto) {
        const hashedPassword = await bcrypt.hash(registerUserDto.password, 12);
        const user = await this.userService.create({
            ...registerUserDto,
            password: hashedPassword,
        });
        return user;
    }
    async login(loginUserDto) {
        const user = await this.userService.findOneByEmail(loginUserDto.email);
        console.log(user);
        if (!user || !(await bcrypt.compare(loginUserDto.password, user.password))) {
            throw new common_1.ForbiddenException('Invalid username or password');
        }
        const tokens = await this.tokenService.generateTokens(user);
        return tokens;
    }
    async refreshToken(refreshToken) {
        const tokens = await this.tokenService.refreshToken(refreshToken);
        return tokens;
    }
    async logout(userId) {
        const user = await this.userService.findOneById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        await this.tokenService.deleteTokensByUserId(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UserService,
        token_service_1.TokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map