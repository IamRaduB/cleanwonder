import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Request } from 'express';
import { PatientService } from './patient.service';
import { JwtUser } from '../auth/dto/jwt-payload';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UploadService } from '../upload/upload.service';
import { NotFoundError } from '@mikro-orm/core';

@Controller('patient')
export class PatientController {
  constructor(private patientService: PatientService, private uploadService: UploadService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  onboard(@Body() createPatientDto: CreatePatientDto, @Req() req: Request) {
    return this.patientService.create((req.user as JwtUser).id, createPatientDto);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getOwnProfile(@Req() req: Request) {
    const patient = await this.patientService.getPatientById((req.user as JwtUser).id);
    return {
      ...patient,
      details: undefined,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPatient(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const patient = await this.patientService.getPatientById(id);
    if (patient.practitioner.id !== (req.user as JwtUser).id) {
      throw new UnauthorizedException(
        `Unable to access patient ${id} details. Patient not registered to logged in practitioner.`,
      );
    }

    if (!patient) {
      throw new NotFoundError(`Patient ${id} not found`);
    }

    return patient;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async confirmPatientAccount(@Req() req: Request, @Body() confirmPatientDto: UpdatePatientDto) {
    const patient = await this.patientService.confirmPatient((req.user as JwtUser).id, confirmPatientDto);
    return {
      ...patient,
      details: undefined,
    };
  }

  @Get('avatar-upload-url')
  @UseGuards(JwtAuthGuard)
  async getAvatarUploadUrl(@Query('mime') mime: string) {
    return {
      url: await this.uploadService.getPatientAvatarUploadUrl(mime),
    };
  }
}
