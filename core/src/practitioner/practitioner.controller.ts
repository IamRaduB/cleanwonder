import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PractitionerService } from './practitioner.service';
import { CreatePractitionerDto } from './dto/create-practitioner.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/dto/jwt-payload';
import { AuthService, JWT_EXPIRATION } from '../auth/auth.service';
import { UpdatePractitionerDto } from './dto/update-practitioner.dto';
import { UploadService } from '../upload/upload.service';
import { PatientService } from '../patient/patient.service';

@Controller('practitioner')
export class PractitionerController {
  private readonly logger = new Logger(PractitionerController.name);
  constructor(
    private readonly practitionerService: PractitionerService,
    private authService: AuthService,
    private uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPractitionerDto: CreatePractitionerDto, @Req() req: Request) {
    const practitioner = await this.practitionerService.create((req.user as JwtUser).id, createPractitionerDto);
    const token = await this.authService.login(req.user as JwtUser, { expiresIn: JWT_EXPIRATION.LOGIN });
    return { token, practitioner };
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async findSelf(@Req() req: Request) {
    const profile = await this.practitionerService.findOne((req.user as JwtUser).id);
    if (!profile) {
      throw new NotFoundException('Practitioner profile was not found');
    }

    return profile;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePractitioner(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePractitionerDto: UpdatePractitionerDto,
  ) {
    return this.practitionerService.update(id, updatePractitionerDto);
  }

  @Get('avatar-upload-url')
  @UseGuards(JwtAuthGuard)
  async getAvatarUploadUrl(@Query('mime') mime: string) {
    return {
      url: await this.uploadService.getPractitionerAvatarUploadUrl(mime),
    };
  }

  @Get('patients')
  @UseGuards(JwtAuthGuard)
  async getPatients(@Req() req: Request) {
    return this.practitionerService.getPatients((req.user as JwtUser).id);
  }
}
