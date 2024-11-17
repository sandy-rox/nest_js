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
exports.SeederService = void 0;
const bcrypt = require("bcryptjs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../users/entities/role.entity");
let SeederService = class SeederService {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    async seed() {
        const roles = ['admin', 'editor', 'viewer'];
        for (const roleName of roles) {
            const existingRole = await this.roleRepository.findOne({ where: { name: roleName } });
            if (!existingRole) {
                const role = new role_entity_1.Role();
                role.name = roleName;
                await this.roleRepository.save(role);
                console.log(`Role "${roleName}" seeded successfully.`);
            }
            else {
                console.log(`Role "${roleName}" already exists.`);
            }
        }
        const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });
        if (adminRole) {
            const existingAdminUser = await this.userRepository.findOne({ where: { email: 'admin@example.com' } });
            if (!existingAdminUser) {
                const hashedPassword = await bcrypt.hash('adminpassword123', 12);
                const adminUser = new user_entity_1.User();
                adminUser.email = 'admin@example.com';
                adminUser.password = hashedPassword;
                adminUser.firstName = 'Admin';
                adminUser.lastName = 'User';
                adminUser.roles = [adminRole];
                await this.userRepository.save(adminUser);
                console.log('Admin user created successfully.');
            }
            else {
                console.log('Admin user already exists.');
            }
        }
        else {
            console.log('Admin role not found, skipping admin user creation.');
        }
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SeederService);
//# sourceMappingURL=seeder.service.js.map