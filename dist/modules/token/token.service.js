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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("./entities/token.entity");
const typeorm_2 = require("typeorm");
const jsonwebtoken_1 = require("jsonwebtoken");
const users_service_1 = require("../users/users.service");
let TokenService = class TokenService {
    constructor(tokenRepository, userService) {
        this.tokenRepository = tokenRepository;
        this.userService = userService;
    }
    async saveTokens(user, refreshToken, refreshTokenExpiresAt) {
        const token = this.tokenRepository.create({
            user,
            refreshToken,
            refreshTokenExpiresAt,
        });
        await this.tokenRepository.save(token);
    }
    async deleteTokensByUserId(user) {
        await this.tokenRepository.delete({ user: { id: user.id } });
    }
    async findRefreshToken(refreshToken) {
        const token = await this.tokenRepository.findOne({
            where: { refreshToken },
        });
        if (!token)
            return undefined;
        const currentTime = new Date();
        if (token.refreshTokenExpiresAt < currentTime) {
            await this.tokenRepository.delete({ refreshToken });
            return undefined;
        }
        return token;
    }
    async deleteExpiredTokens() {
        await this.tokenRepository
            .createQueryBuilder()
            .delete()
            .where('refreshTokenExpiresAt <= :now', { now: new Date() })
            .execute();
    }
    createAccessToken({ userId, roles }) {
        return (0, jsonwebtoken_1.sign)({ userId, roles }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m',
        });
    }
    createRefreshToken({ userId }) {
        return (0, jsonwebtoken_1.sign)({ userId }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d',
        });
    }
    async generateTokens(user) {
        const { id: userId, roles } = user;
        const accessToken = this.createAccessToken({ userId, roles });
        const refreshToken = this.createRefreshToken({ userId });
        const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.deleteTokensByUserId(user);
        await this.saveTokens(user, refreshToken, refreshTokenExpiresAt);
        return { accessToken, refreshToken };
    }
    async refreshToken(refreshToken) {
        let decodedToken;
        try {
            decodedToken = (0, jsonwebtoken_1.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        }
        catch (error) {
            console.log(error);
            throw new Error('Invalid refresh token.');
        }
        if (typeof decodedToken === 'object' && 'userId' in decodedToken) {
            const user = await this.userService.findOneById(decodedToken.userId);
            if (!user) {
                throw new common_1.NotFoundException('User not found.');
            }
            const activeToken = await this.findRefreshToken(refreshToken);
            if (!activeToken) {
                throw new Error('Refresh token is no longer valid.');
            }
            const { id: userId, roles } = user;
            const accessToken = this.createAccessToken({ userId, roles });
            return { accessToken, refreshToken };
        }
        else {
            throw new Error('Invalid refresh token structure.');
        }
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UserService])
], TokenService);
//# sourceMappingURL=token.service.js.map