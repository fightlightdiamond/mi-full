import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { DatabaseModule } from '@app/common/database';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { HealthModule } from './health/health.module';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [DatabaseModule, ConfigModule, LoggerModule, HealthModule],
})
export class CommonModule {}
