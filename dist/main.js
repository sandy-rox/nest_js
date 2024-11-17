"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const seeder_service_1 = require("./modules/seeder/seeder.service");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: { origin: process.env.CLIENT_ORIGIN },
    });
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    app.use(cookieParser());
    const seederService = app.get(seeder_service_1.SeederService);
    await seederService.seed();
    await app.listen(PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map