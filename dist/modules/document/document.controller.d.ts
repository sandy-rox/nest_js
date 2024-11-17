import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
export declare class DocumentController {
    private readonly documentService;
    private readonly logger;
    constructor(documentService: DocumentService);
    uploadDocument(createDocumentDto: CreateDocumentDto, file: Express.Multer.File, req: Request): Promise<import("./entities/document.entity").Document>;
    findAll(req: any): Promise<import("./entities/document.entity").Document[]>;
    findOne(id: number, req: any): Promise<import("./entities/document.entity").Document>;
    remove(id: number, req: any): Promise<void>;
    update(id: number, updateDocumentDto: CreateDocumentDto, req: any): Promise<import("./entities/document.entity").Document>;
}
