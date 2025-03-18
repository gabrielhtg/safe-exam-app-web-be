import { Module } from '@nestjs/common';
import { DownloadHonestestService } from './download-honestest.service';
import { DownloadHonestestController } from './download-honestest.controller';

@Module({
  controllers: [DownloadHonestestController],
  providers: [DownloadHonestestService],
})
export class DownloadHonestestModule {}
