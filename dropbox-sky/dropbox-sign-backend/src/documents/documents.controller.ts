import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('/getTemplate/:template_id')
  async getDocumentData(@Param('template_id') templateId: string) {
    return this.documentsService.fetchDocumentData(templateId);
  }

  @Post("send-for-signing")
  @HttpCode(200)
  async sendForSigning(
    @Body()
    body: {
      templateId: string;
      subject: string;
      message: string;
      signers: { role: string; emailAddress: string; name: string }[];
    }
  ) {
    return this.documentsService.sendTemplateForSign(
      body.templateId,
      body.subject,
      body.message,
      body.signers
    );
  }

  @Get("/getSignData/:signatureRequestId")
  async getSignatureRequest(@Param("signatureRequestId") signatureRequestId: string) {
    try {
      return await this.documentsService.getSignatureRequestById(signatureRequestId);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch signature request: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
