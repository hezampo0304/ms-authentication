import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {

  constructor(
    private readonly configService: ConfigService,
  ) {}

  async hash(password: string): Promise<string> {
    const rounds = this.configService.get<number>(
      'auth.bcrypt.saltRounds',
    )!;
    return bcrypt.hash(password, rounds);
  }

  async compare(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}