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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("./entities/role.entity");
let UserService = class UserService {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    async create(userData) {
        const existingUser = await this.findOneByEmail(userData.email);
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists.');
        }
        try {
            let viewerRole = await this.roleRepository.findOne({ where: { name: 'viewer' } });
            if (!viewerRole) {
                viewerRole = this.roleRepository.create({ name: 'viewer' });
                await this.roleRepository.save(viewerRole);
            }
            const user = this.userRepository.create({
                ...userData,
                roles: [viewerRole],
            });
            await this.userRepository.save(user);
            return user;
        }
        catch (error) {
            console.error(error);
            throw new common_1.BadRequestException('Failed to register user.');
        }
    }
    async updateUserRole(userId, roleName) {
        const user = await this.findOneById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        const role = await this.roleRepository.findOne({ where: { name: roleName } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found.');
        }
        user.roles = [role];
        return this.userRepository.save(user);
    }
    async findOneByEmail(email) {
        return await this.userRepository.findOne({
            where: { email: email.toLowerCase() },
        });
    }
    async findOneById(userId) {
        return await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles'],
        });
    }
    async findAll() {
        return await this.userRepository.find();
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=users.service.js.map