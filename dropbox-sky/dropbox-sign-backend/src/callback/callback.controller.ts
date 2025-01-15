import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { EventCallbackRequest, EventCallbackHelper } from '@dropbox/sign';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('callback')
export class CallbackController {
    constructor(private readonly configService: ConfigService,) {}
    
    @Post()
    handleCallback(@Body() body: any, @Req() req: Request, @Res() res: Response): void {
        try {
            const DROPBOX_SIGN_API_KEY = this.configService.get<string>('DROPBOX_SIGN_API_KEY');
            const callbackEvent = EventCallbackRequest.init(body);

            if (EventCallbackHelper.isValid(DROPBOX_SIGN_API_KEY, callbackEvent)) {
                const callbackType = EventCallbackHelper.getCallbackType(callbackEvent);
                console.log('Callback Type:', callbackType);
                console.log('Event Data:', callbackEvent);

                res.status(200).send('Callback received and verified.');
            } else {
                res.status(400).send('Invalid callback.');
            }
        } catch (error) {
            console.error('Error handling callback:', error.message);
            res.status(500).send('Internal Server Error');
        }
    }
}
