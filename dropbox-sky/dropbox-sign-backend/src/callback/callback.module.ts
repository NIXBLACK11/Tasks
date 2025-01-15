import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallbackController } from './callback.controller';
import { SignatureRequest } from '../documents/entities/signature-request.entity';
import { Signer } from '../documents/entities/signer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SignatureRequest, Signer])],
  controllers: [CallbackController],
})
export class CallbackModule {}
