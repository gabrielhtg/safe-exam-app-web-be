import {
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DownloadHonestestService } from './download-honestest.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadAppLinux, uploadAppWindows } from '../multer.config';
import { Response } from 'express';

@Controller('download-honestest')
export class DownloadHonestestController {
  constructor(
    private readonly downloadHonestestService: DownloadHonestestService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('windows_app', uploadAppWindows))
  saveWindows(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    return this.downloadHonestestService.saveWindows(file, response);
  }

  @Post()
  @UseInterceptors(FileInterceptor('linux_app', uploadAppLinux))
  saveLinux(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    return this.downloadHonestestService.saveLinux(file, response);
  }
}
