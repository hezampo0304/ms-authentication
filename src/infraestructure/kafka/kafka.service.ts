import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import {
  Kafka,
  Producer,
} from 'kafkajs';

@Injectable()
export class KafkaService
  implements OnModuleInit, OnModuleDestroy {

  private readonly kafka: Kafka;

  private readonly producer: Producer;

  constructor() {

    this.kafka = new Kafka({
      clientId: 'ms-authentication',

      brokers: [
        process.env.KAFKA_BROKER ?? 'localhost:9092',
      ],
    });

    this.producer =
      this.kafka.producer();
  }

  async onModuleInit(): Promise<void> {

    await this.producer.connect();

    console.log(
      'Kafka producer connected',
    );
  }

  async onModuleDestroy(): Promise<void> {

    await this.producer.disconnect();

    console.log(
      'Kafka producer disconnected',
    );
  }

  async publish<T>(
    topic: string,
    message: T,
  ): Promise<void> {

    await this.producer.send({
      topic,

      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }
}