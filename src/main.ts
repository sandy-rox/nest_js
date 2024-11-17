import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { SeederService } from './modules/seeder/seeder.service';

//import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
//import { RolesGuard } from './auth/gaurd/role.guard';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.CLIENT_ORIGIN },
  });

  //app.use(helmet);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cookieParser());
  const seederService = app.get(SeederService);
  await seederService.seed();
  await app.listen(PORT);
}
bootstrap();
