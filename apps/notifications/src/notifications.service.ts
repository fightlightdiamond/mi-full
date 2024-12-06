import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService, private readonly mailerService: MailerService) {}

  async notifyEmail({ email, text }: NotifyEmailDto) {
    await this.mailerService
      .sendMail({
        to: email, // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: text, // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {console.log('=========> Notification Successfully')})
      .catch(() => {});
  }
}
