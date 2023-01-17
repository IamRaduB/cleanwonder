import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { UploadService } from '../upload/upload.service';

@Controller('clinic')
export class ClinicController {
  constructor(private clinicService: ClinicService, private uploadService: UploadService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateClinicDto: UpdateClinicDto) {
    return this.clinicService.update(+id, updateClinicDto);
  }

  @Get()
  async search(@Query('vat') vat: string) {
    return this.clinicService.findByVatId(vat);
  }

  @Get('avatar-upload-url')
  @UseGuards(JwtAuthGuard)
  async getAvatarUploadUrl(@Query('mime') mime: string) {
    return {
      url: await this.uploadService.getClinicAvatarUploadUrl(mime),
    };
  }
}
