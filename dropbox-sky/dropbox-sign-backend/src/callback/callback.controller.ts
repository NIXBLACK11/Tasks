import { Controller, Post, Body, Req, Res, Get, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { EventCallbackRequest, EventCallbackHelper } from '@dropbox/sign';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
  
@Controller('callback')
export class CallbackController {
    constructor(private readonly configService: ConfigService) {}

    @Get()
    getHello(): string {
        return "them them";
    }

    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    handleCallback(
        @UploadedFiles() files: any[],
        @Req() req: Request,
        @Res() res: Response
    ): void {
        try {
            const DROPBOX_SIGN_API_KEY = this.configService.get<string>('DROPBOX_SIGN_API_KEY');

            console.log('Body:', req.body);

            const callbackEvent = EventCallbackRequest.init(req.body);

            if (EventCallbackHelper.isValid(DROPBOX_SIGN_API_KEY, callbackEvent)) {
                const callbackType = EventCallbackHelper.getCallbackType(callbackEvent);
                console.log('Callback Type:', callbackType);
                console.log('Event Data:', callbackEvent);

                res.status(200).send('Callback received and verified.');
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
  