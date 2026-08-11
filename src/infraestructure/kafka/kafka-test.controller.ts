import {
  Controller,
  Post,
} from '@nestjs/common';

import { randomUUID } from 'crypto';

import { KafkaService } from './kafka.service';

interface UserAuthenticatedEvent {
  eventId: string;
  eventType: string;
  occurredAt: string;
  userId: string;
  tenantId: string;
  sessionId: string;
  provider: string;
}

@Controller('kafka')
export class KafkaTestController {

  constructor(
    private readonly kafkaService: KafkaService,
  ) {}

  @Post('test')
  async test(): Promise<{
    success: boolean;
    eventId: string;
  }> {

    const event: UserAuthenticatedEvent = {
      eventId: randomUUID(),

      eventType: 'USER_AUTHENTICATED',

      occurredAt:
        new Date().toISOString(),

      userId:
        '00000000-0000-0000-0000-000000000001',

      tenantId:
        '00000000-0000-0000-0000-000000000002',

      sessionId:
        randomUUID(),

      provider: 'LOCAL',
    };

    await this.kafkaService.publish(
      process.env.KAFKA_AUTH_EVENTS_TOPIC ??
        'auth.events',

      event,
    );

    return {
      success: true,
      eventId: event.eventId,
    };
  }
}