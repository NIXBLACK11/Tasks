import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignatureRequest } from './entities/signature-request.entity';
import { Signer } from './entities/signer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SignatureRequest, Signer]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService]
})
export class DocumentsModule {}
