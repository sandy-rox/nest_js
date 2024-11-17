import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/modules/users/users.service';
export declare class AuthMiddleware implements NestMiddleware {
    private readonly userService;
    constructor(userService: UserService);
    use(req: Request | any, res: Response, next: () => void): Promise<void>;
}
