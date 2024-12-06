import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        HOST_MAIL: Joi.string().required(),
        PORT_MAIL: Joi.number().required(),
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('HOST_MAIL', 'mailhog'),
          port: configService.get<number>('PORT_MAIL', 1025),
          ignoreTLS: true,
          secure: false,
          // auth: {
          //   user: process.env.MAILDEV_INCOMING_USER ?? 'MAILDEV_INCOMING_USER',
          //   pass: process.env.MAILDEV_INCOMING_PASS ?? 'MAILDEV_INCOMING_PASS',
          // },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        // template: {
        //   dir: __dirname + '/templates',
        //   // adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
