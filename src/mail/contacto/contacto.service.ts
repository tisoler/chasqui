import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { MailConfig } from '../config/mail-config.type';
import { ResendSendResponse } from '../shared/resend-mail.types';
import { escapeHtml } from '../shared/escape-html';
import { parseEmailList } from '../shared/email-list';

@Injectable()
export class ContactoService {
  async enviarContacto(dto: CreateContactoDto, config: MailConfig) {
    const html = this.buildHtml(dto, config.appName);
    const text = this.buildText(dto, config.appName);
    const emailsTo = parseEmailList(config.contactToEmail);

    if (emailsTo.length === 0) {
      throw new BadRequestException('contactToEmail no tiene destinatarios válidos');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'chasqui/0.0.1',
      },
      body: JSON.stringify({
        from: `${config.appName} <${config.contactFromEmail}>`,
        to: emailsTo,
        reply_to: dto.email,
        subject: `Nuevo contacto desde formulario de la web - ${dto.nombreApellido}`,
        html,
        text,
      }),
    });

    const payload = (await response.json()) as ResendSendResponse;

    if (!response.ok) {
      const message = payload.error?.message ?? 'No se pudo enviar el correo';
      throw new BadRequestException(message);
    }

    return { ok: true, id: payload.id };
  }

  private buildHtml(dto: CreateContactoDto, appName: string) {
    const mensaje = dto.mensaje?.trim() || 'Sin mensaje adicional.';

    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 16px;">Nuevo contacto desde ${appName}</h2>
        <p style="margin: 0 0 12px;"><strong>Nombre y apellido:</strong> ${escapeHtml(dto.nombreApellido)}</p>
        <p style="margin: 0 0 12px;"><strong>Email:</strong> ${escapeHtml(dto.email)}</p>
        <p style="margin: 0 0 12px;"><strong>Me interesa:</strong> ${escapeHtml(dto.interes)}</p>
        <p style="margin: 0 0 12px;"><strong>Mensaje:</strong><br/>${escapeHtml(mensaje).replace(/\n/g, '<br/>')}</p>
      </div>
    `;
  }

  private buildText(dto: CreateContactoDto, appName: string) {
    const mensaje = dto.mensaje?.trim() || 'Sin mensaje adicional.';
    return [
      `Nuevo contacto desde ${appName}`,
      `Nombre y apellido: ${dto.nombreApellido}`,
      `Email: ${dto.email}`,
      `Me interesa: ${dto.interes}`,
      `Mensaje: ${mensaje}`,
    ].join('\n');
  }
}
