import * as DropboxSign from "@dropbox/sign";
import { ConfigService } from '@nestjs/config';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SignatureRequest } from "./entities/signature-request.entity";
import { Signer } from "./entities/signer.entity";

@Injectable()
export class DocumentsService {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(SignatureRequest)
        private signatureRequestRepository: Repository<SignatureRequest>,
        @InjectRepository(Signer)
        private signerRepository: Repository<Signer>,
    ) {}
    async fetchDocumentData(templateId: string) {
        try {

            const templateApi = new DropboxSign.TemplateApi();
            const DROPBOX_SIGN_API_KEY = this.configService.get<string>('DROPBOX_SIGN_API_KEY');
            templateApi.username = DROPBOX_SIGN_API_KEY;
                        
            const result = await templateApi.templateGet(templateId);
            
            return result.body;
        } catch (error) {
            throw new HttpException(
                `Failed to fetch document data: ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async sendTemplateForSign(
        templateId: string,
        subject: string,
        message: string,
        signers: { role: string; emailAddress: string; name: string }[],
      ) {
        try {
            const signatureRequestApi = new DropboxSign.SignatureRequestApi();
            const DROPBOX_SIGN_API_KEY = this.configService.get<string>('DROPBOX_SIGN_API_KEY');
            signatureRequestApi.username = DROPBOX_SIGN_API_KEY;
        
            const formattedSigners = signers.map((signer) => ({
                role: signer.role,
                emailAddress: signer.emailAddress,
                name: signer.name,
            }));

            const signingOptions: DropboxSign.SubSigningOptions = {
                draw: true,
                type: true,
                upload: true,
                phone: false,
                defaultType: DropboxSign.SubSigningOptions.DefaultTypeEnum.Draw,
            };
        
            const data: DropboxSign.SignatureRequestSendWithTemplateRequest = {
                templateIds: [templateId],
                subject: subject,
                message: message,
                signers: formattedSigners,
                signingOptions: signingOptions,
                testMode: true,
            };
        
            const result = await signatureRequestApi.signatureRequestSendWithTemplate(data);
            

            const signatureRequest = new SignatureRequest();
            signatureRequest.signature_request_id = result.body.signatureRequest.signatureRequestId;
            signatureRequest.is_complete = result.body.signatureRequest.isComplete;
            signatureRequest.is_declined = result.body.signatureRequest.isDeclined;
            signatureRequest.final_copy_url = result.body.signatureRequest.finalCopyUri;
            signatureRequest.details_url = result.body.signatureRequest.detailsUrl;
            signatureRequest.template_id = result.body.signatureRequest.templateIds[0];

            await this.signatureRequestRepository.save(signatureRequest);

            for (const signer of result.body.signatureRequest.signatures) {
                const newSigner = new Signer();
                newSigner.signature_id = signer.signatureId;
                newSigner.signer_email_address = signer.signerEmailAddress;
                newSigner.signer_name = signer.signerName;
                newSigner.signer_role = signer.signerRole;
                newSigner.status_code = signer.statusCode;
                newSigner.signatureRequest = signatureRequest;

                await this.signerRepository.save(newSigner);
            }

            return result.body;
        } catch (error) {
            console.log(error);
            throw new HttpException(
                `Failed to send template for signing: ${error.message}`,
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async getSignatureRequestById(signatureRequestId: string) {
        const signatureRequest = await this.signatureRequestRepository.findOne({
            where: { signature_request_id: signatureRequestId },
            relations: ["signers"],
        });
    
        if (!signatureRequest) {
            throw new NotFoundException(`Signature request with ID ${signatureRequestId} not found.`);
        }
    
        return signatureRequest;
    }
}
