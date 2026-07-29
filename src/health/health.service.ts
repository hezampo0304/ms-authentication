import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stat } from 'fs';

@Injectable()
export class HealthService {
    constructor(private readonly configService: ConfigService) {}

    getHealth() {
        const appName = this.configService.get<string>('APP_NAME');
        const appVersion = this.configService.get<string>('APP_VERSION');
        const nodeEnv = this.configService.get<string>('NODE_ENV');
        const port = this.configService.get<number>('PORT');

        return {
            success: true,
            service: appName,
            version: appVersion,
            environment: nodeEnv,
            port: port,
            status: 'UP',
            timestamp: new Date().toISOString(),
        };
    }
}
