import { Token } from '../../token/entities/token.entity';
import { Document } from '../../document/entities/document.entity';
import { Role } from './role.entity';
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[];
    createdAt: Date;
    updatedAt: Date;
    password: string;
    token: Token;
    documents: Document[];
}
