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
var DocumentController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const role_guard_1 = require("../auth/guard/role.guard");
const document_service_1 = require("./document.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const create_document_dto_1 = require("./dto/create-document.dto");
let DocumentController = DocumentController_1 = class DocumentController {
    constructor(documentService) {
        this.documentService = documentService;
        this.logger = new common_1.Logger(DocumentController_1.name);
    }
    async uploadDocument(createDocumentDto, file, req) {
        this.logger.log('Received request to upload document');
        if (!file) {
            this.logger.error('File upload failed: No file received');
            throw new Error('File upload failed');
        }
        this.logger.log(`File received: ${file.originalname}`);
        this.logger.debug(`Received DTO: ${JSON.stringify(createDocumentDto)}`);
        const user = req['user'];
        if (!user) {
            this.logger.warn('No user information found in request');
        }
        else {
            this.logger.log(`User found: ${JSON.stringify(user)}`);
        }
        try {
            this.logger.log('Attempting to create a document entry in the service');
            const result = await this.documentService.create(createDocumentDto, file, user);
            this.logger.log('Document successfully created');
            return result;
        }
        catch (error) {
            this.logger.error('Error while creating document:', error);
            throw error;
        }
    }
    async findAll(req) {
        const user = req.user;
        return this.documentService.findAll(user);
    }
    async findOne(id, req) {
        const user = req.user;
        return this.documentService.findOne(id, user);
    }
    async remove(id, req) {
        const user = req.user;
        return this.documentService.remove(id, user);
    }
    async update(id, updateDocumentDto, req) {
        const user = req.user;
        return this.documentService.update(id, updateDocumentDto, user);
    }
};
exports.DocumentController = DocumentController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const sanitizedFilename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                cb(null, sanitizedFilename);
            },
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_document_dto_1.CreateDocumentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('viewer', 'editor', 'admin'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('viewer', 'editor', 'admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('viewer', 'editor', 'admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('viewer', 'editor', 'admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_document_dto_1.CreateDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "update", null);
exports.DocumentController = DocumentController = DocumentController_1 = __decorate([
    (0, common_1.Controller)({ path: 'documents', version: '1' }),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    __metadata("design:paramtypes", [document_service_1.DocumentService])
], DocumentController);
//# sourceMappingURL=document.controller.js.map