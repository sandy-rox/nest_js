import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { SeederService } from './modules/seeder/seeder.service';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

/**
 * Default port for the application, either taken from environment variables or defaulting to 3000
 */
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  // Create an instance of the NestJS application using the AppModule
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.CLIENT_ORIGIN }, // Enable CORS and allow the client origin to be set dynamically
  });

  // Use Helmet to secure HTTP headers
  app.use(helmet());

  // Set global prefix for API endpoints (e.g., '/api/v1')
  app.setGlobalPrefix('api');

  // Enable API versioning using URI versioning strategy (e.g., '/api/v1')
  app.enableVersioning({
    type: VersioningType.URI, // URI versioning (e.g., /api/v1/resource)
  });

  // Parse cookies in incoming requests
  app.use(cookieParser());

  // Access SeederService and run database seeding process (e.g., populating initial data)
  const seederService = app.get(SeederService);
  await seederService.seed();

  // Start the application and listen on the specified port
  await app.listen(PORT, () => {
    console.log(`Application is running on: http://localhost:${PORT}`);
  });
}

// Call bootstrap function to initialize the app
bootstrap();
