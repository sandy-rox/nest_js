import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now(); // Record the start time

    // Log request details
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
      const duration = Date.now() - start; // Calculate the time taken
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });

    next(); // Pass control to the next middleware or route handler
  }
}
