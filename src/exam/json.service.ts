import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JsonService {
  readJsonFile(filePath: string): any {
    const absolutePath = path.resolve(filePath); // Resolusi ke path absolut
    const data = fs.readFileSync(absolutePath, 'utf8'); // Membaca file secara sinkron
    return JSON.parse(data); // Parse JSON ke dalam objek
  }
}
