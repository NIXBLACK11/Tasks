import { Controller, Post, Body, Req, Res, Get, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { EventCallbackRequest, EventCallbackHelper } from '@dropbox/sign';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { SignatureRequest } from 'src/documents/entities/signature-request.entity';
import { Signer } from 'src/documents/entities/signer.entity';
import { Repository } from 'typeorm';
  
@Controller('callback')
export class CallbackController {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(SignatureRequest)
        private signatureRequestRepository: Repository<SignatureRequest>,
        @InjectRepository(Signer)
        private signerRepository: Repository<Signer>,
    ) {}

    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    async handleCallback(
        @UploadedFiles() files: any[],
        @Req() req: Request,
        @Res() res: Response
    ): Promise<void> {
        try {
            const DROPBOX_SIGN_API_KEY = this.configService.get<string>('DROPBOX_SIGN_API_KEY');

            let callbackBody;
            if (req.body.json) {
                callbackBody = JSON.parse(req.body.json);
            } else {
                callbackBody = req.body;
            }
            console.log(callbackBody);

            const callbackEvent = EventCallbackRequest.init(callbackBody);

            if (EventCallbackHelper.isValid(DROPBOX_SIGN_API_KEY, callbackEvent)) {
                const eventType = callbackBody.event.event_type;
                const signatureRequestData = callbackBody.signature_request;

                if (callbackBody.event.event_metadata?.related_signature_id) {
                    const relatedSignatureId = callbackBody.event.event_metadata.related_signature_id;
                    const statusCode = eventType;

                    await this.signerRepository.update(
                        { signature_id: relatedSignatureId },
                        { status_code: statusCode }
                    );
                } else {
                    const signatureRequestId = signatureRequestData.signature_request_id;
                    const isComplete = signatureRequestData.is_complete;
                    const isDeclined = signatureRequestData.is_declined;

                    await this.signatureRequestRepository.update(
                        { signature_request_id: signatureRequestId },
                        { is_complete: isComplete, is_declined: isDeclined }
                    );
                }

                console.log('Callback Type:', eventType);
                res.status(200).send('Hello API Event Received');
            } else {
                console.warn('Invalid callback received:', req.body);
                res.status(400).send('Invalid callback.');
            }
        } catch (error) {
            console.error('Error handling callback:', error.message, 'Body:', req.body);
            res.status(500).send('Internal Server Error');
        }
    }
}