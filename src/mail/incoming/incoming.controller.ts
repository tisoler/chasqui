import { Body, Controller, HttpCode, InternalServerErrorException, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { IncomingService } from './incoming.service';
import { ResendIncomingWebhookPayload } from './types/resend-incoming-webhook';
import { IncomingMailConfig } from '../config/mail-config.type';

@ApiTags('Incoming')
@Controller('mail')
export class IncomingController {
  constructor(
    private readonly incomingService: IncomingService,
    private readonly configService: ConfigService,
  ) { }

  @Post('incoming/eos')
  @HttpCode(200)
  @ApiOperation({ summary: 'Recibir webhook de Resend para Fundacioneos' })
  async recibirIncomingEos(
    @Req() req: Request & { rawBody?: Buffer },
    @Body() body: ResendIncomingWebhookPayload,
  ) {
    const config = this.resolveEosConfig('FUNDACIONEOS');
    return this.incomingService.handleWebhook(
      {
        body,
        rawBody: req.rawBody?.toString('utf8') ?? null,
        headers: req.headers as Record<string, string | string[] | undefined>,
      },
      config,
    );
  }

  @Post('incoming/astre')
  @HttpCode(200)
  @ApiOperation({ summary: 'Recibir webhook de Resend para Astre' })
  async recibirIncomingAstre(
    @Req() req: Request & { rawBody?: Buffer },
    @Body() body: ResendIncomingWebhookPayload,
  ) {
    const config = this.resolveEosConfig('ASTRE');
    return this.incomingService.handleWebhook(
      {
        body,
        rawBody: req.rawBody?.toString('utf8') ?? null,
        headers: req.headers as Record<string, string | string[] | undefined>,
      },
      config,
    );
  }

  @Post('incoming/scoler')
  @HttpCode(200)
  @ApiOperation({ summary: 'Recibir webhook de Resend para Scoler' })
  async recibirIncomingScoler(
    @Req() req: Request & { rawBody?: Buffer },
    @Body() body: ResendIncomingWebhookPayload,
  ) {
    const config = this.resolveEosConfig('SCOLER');
    return this.incomingService.handleWebhook(
      {
        body,
        rawBody: req.rawBody?.toString('utf8') ?? null,
        headers: req.headers as Record<string, string | string[] | undefined>,
      },
      config,
    );
  }

  private resolveEosConfig(prefix: string): IncomingMailConfig {
    const resendApiKey = this.configService.get<string>(`${prefix}_RESEND_API_KEY`);
    const resendWebhookSigningSecret = this.configService.get<string>(`${prefix}_RESEND_WEBHOOK_SIGNING_SECRET`);
    const contactFromEmail = this.configService.get<string>(`${prefix}_CONTACT_FROM_EMAIL`);
    const contactToEmail = this.configService.get<string>(`${prefix}_CONTACT_TO_EMAIL`);
    const incomingToEmails = this.configService.get<string>(`${prefix}_INCOMING_TO_EMAILS`);
    const appName = this.configService.get<string>(`${prefix}_APP_NAME`) ?? 'Fundacioneos';
    const resendWebhookToleranceSeconds = this.configService.get<number>('RESEND_WEBHOOK_TOLERANCE_SECONDS') ?? 300;

    if (!resendApiKey) {
      throw new InternalServerErrorException(`Falta configurar ${prefix}_RESEND_API_KEY`);
    }
    if (!resendWebhookSigningSecret) {
      throw new InternalServerErrorException(`Falta configurar ${prefix}_RESEND_WEBHOOK_SIGNING_SECRET`);
    }

    return {
      appName,
      resendApiKey,
      resendWebhookSigningSecret,
      contactFromEmail: contactFromEmail ?? 'contacto@chasquimensajero.net.ar',
      contactToEmail: contactToEmail ?? '',
      incomingToEmails,
      resendWebhookToleranceSeconds,
    };
  }
}
