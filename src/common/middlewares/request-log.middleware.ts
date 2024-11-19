import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to log incoming requests and their response times.
 * This middleware logs the request method, URL, and the duration
 * it takes to process and respond to the request.
 */
@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
  /**
   * This method is called when a request is received. It logs the request
   * details (method and URL) and records the time it takes to complete the request.
   *
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function in the request pipeline.
   */
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now(); // Record the start time

    // Log the request method and original URL with a timestamp
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

    // Attach a listener for the 'finish' event to log the response details after the request is complete
    res.on('finish', () => {
      const duration = Date.now() - start; // Calculate the time taken for the request to complete
      // Log the method, original URL, status code, and request duration
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });

    // Call the next middleware or route handler in the pipeline
    next();
  }
}
