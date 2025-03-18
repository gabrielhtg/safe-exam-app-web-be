import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class DownloadHonestestService {
  async saveWindows(file: Express.Multer.File, res: Response) {
    return res.status(200).json({
      message: 'Success',
      data: file,
    });
  }

  async saveLinux(file: Express.Multer.File, res: Response) {
    return res.status(200).json({
      message: 'Success',
      data: file,
    });
  }
}
