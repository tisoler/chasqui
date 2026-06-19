import { Body, Controller, HttpCode, InternalServerErrorException, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ContactoService } from './contacto.service';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { MailConfig } from '../config/mail-config.type';

@ApiTags('Contacto')
@Controller('mail')
export class ContactoController {
  constructor(
    private readonly contactoService: ContactoService,
    private readonly configService: ConfigService,
  ) { }

  @Post('contacto/eos')
  @HttpCode(200)
  @ApiOperation({ summary: 'Enviar formulario de contacto de Fundacioneos' })
  @ApiBody({ type: CreateContactoDto })
  enviarContactoEos(@Body() dto: CreateContactoDto) {
    const config = this.resolveEosConfig('FUNDACIONEOS');
    return this.contactoService.enviarContacto(dto, config);
  }

  @Post('contacto/astre')
  @HttpCode(200)
  @ApiOperation({ summary: 'Enviar formulario de contacto de Astre' })
  @ApiBody({ type: CreateContactoDto })
  enviarContactoAstre(@Body() dto: CreateContactoDto) {
    const config = this.resolveEosConfig('ASTRE');
    return this.contactoService.enviarContacto(dto, config);
  }

  @Post('contacto/scoler')
  @HttpCode(200)
  @ApiOperation({ summary: 'Enviar formulario de contacto de Scoler' })
  @ApiBody({ type: CreateContactoDto })
  enviarContactoScoler(@Body() dto: CreateContactoDto) {
    const config = this.resolveEosConfig('SCOLER');
    return this.contactoService.enviarContacto(dto, config);
  }

  private resolveEosConfig(prefix: string): MailConfig {
    const resendApiKey = this.configService.get<string>(`${prefix}_RESEND_API_KEY`);
    const contactFromEmail = this.configService.get<string>(`${prefix}_CONTACT_FROM_EMAIL`);
    const contactToEmail = this.configService.get<string>(`${prefix}_CONTACT_TO_EMAIL`);
    const appName = this.configService.get<string>(`${prefix}_APP_NAME`) ?? 'Chasqui mensajero';

    if (!resendApiKey) {
      throw new InternalServerErrorException(`Falta configurar ${prefix}_RESEND_API_KEY`);
    }
    if (!contactToEmail) {
      throw new InternalServerErrorException(`Falta configurar ${prefix}_CONTACT_TO_EMAIL`);
    }

    return {
      appName,
      resendApiKey,
      contactFromEmail: contactFromEmail ?? 'contacto@chasquimensajero.net.ar',
      contactToEmail,
    };
  }
}
