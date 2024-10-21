import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SecurityService {
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async isMatch(encryptedPassword: string, inputPassword: string) {
    return await bcrypt.compare(inputPassword, encryptedPassword);
  }
}
