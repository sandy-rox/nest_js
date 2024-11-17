import { Repository } from 'typeorm';
import { Document } from './/entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { User } from '../users/entities/user.entity';
export declare class DocumentService {
    private readonly documentRepository;
    constructor(documentRepository: Repository<Document>);
    create(createDocumentDto: CreateDocumentDto, file: Express.Multer.File, user: User): Promise<Document>;
    findAll(user: User): Promise<Document[]>;
    findOne(id: number, user: User): Promise<Document>;
    update(id: number, updateDocumentDto: CreateDocumentDto, user: User): Promise<Document>;
    remove(id: number, user: User): Promise<void>;
}
