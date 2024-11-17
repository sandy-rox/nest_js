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
exports.DocumentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_entity_1 = require(".//entities/document.entity");
let DocumentService = class DocumentService {
    constructor(documentRepository) {
        this.documentRepository = documentRepository;
    }
    async create(createDocumentDto, file, user) {
        const document = this.documentRepository.create({
            name: createDocumentDto.name,
            path: file.path,
            uploadedAt: new Date(),
            user: user,
        });
        return this.documentRepository.save(document);
    }
    async findAll(user) {
        if (user.roles && user.roles.some((role) => role.name === 'viewer')) {
            console.log(user);
            return this.documentRepository.find({ where: { user: { id: user.id } } });
        }
        return this.documentRepository.find();
    }
    async findOne(id, user) {
        const document = await this.documentRepository.findOne({ where: { id }, relations: ['user'] });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        if (user.roles && user.roles.some((role) => role.name === 'viewer') && document.user.id !== user.id) {
            throw new common_1.ForbiddenException('You are not authorized to view this document');
        }
        return document;
    }
    async update(id, updateDocumentDto, user) {
        const document = await this.documentRepository.findOne({ where: { id }, relations: ['user'] });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        if (user.roles && user.roles.some((role) => role.name === 'viewer') && document.user.id !== user.id) {
            throw new common_1.ForbiddenException('You are not authorized to update this document');
        }
        document.name = updateDocumentDto.name || document.name;
        document.uploadedAt = new Date();
        return this.documentRepository.save(document);
    }
    async remove(id, user) {
        const document = await this.documentRepository.findOne({ where: { id }, relations: ['user'] });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        if (user.roles && user.roles.some((role) => role.name === 'admin')) {
            await this.documentRepository.delete(id);
            return;
        }
        if (user.roles && user.roles.some((role) => role.name === 'editor') && document.user.id === user.id) {
            await this.documentRepository.delete(id);
            return;
        }
        if (user.roles && user.roles.some((role) => role.name === 'viewer')) {
            throw new common_1.ForbiddenException('You are not authorized to delete documents');
        }
        throw new common_1.ForbiddenException('You are not authorized to delete this document');
    }
};
exports.DocumentService = DocumentService;
exports.DocumentService = DocumentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DocumentService);
//# sourceMappingURL=document.service.js.map