import { Module } from '@nestjs/common';
import { ContactoController } from './contacto/contacto.controller';
import { ContactoService } from './contacto/contacto.service';
import { IncomingController } from './incoming/incoming.controller';
import { IncomingService } from './incoming/incoming.service';

@Module({
  controllers: [ContactoController, IncomingController],
  providers: [ContactoService, IncomingService],
  exports: [ContactoService, IncomingService],
})
export class MailModule {}
