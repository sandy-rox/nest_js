import { User } from '../../users/entities/user.entity';
export declare class Document {
    id: number;
    name: string;
    path: string;
    uploadedAt: Date;
    user: User;
}
