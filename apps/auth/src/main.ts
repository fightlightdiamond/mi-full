import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  //Get env value
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  // New port for microservice
  await createMicroservice(app, configService);
  // post for http
  await app.listen(configService.get('HTTP_PORT'));
}

/**
 * Create Microservice
 *
 * @param app
 * @param configService
 */
async function createMicroservice(
  app: INestApplication,
  configService: ConfigService,
) {
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });
  await app
    .startAllMicroservices()
    .then(() => console.log('-------Authenticate Service started-------'));;
}
bootstrap();
