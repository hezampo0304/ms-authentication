import { Global, Module } from '@nestjs/common';

import { KafkaService } from './kafka.service';
import { KafkaTestController } from './kafka-test.controller';

@Global()
@Module({
  controllers: [
    KafkaTestController,
  ],

  providers: [
    KafkaService,
  ],

  exports: [
    KafkaService,
  ],
})
export class KafkaModule {}