import { Test, TestingModule } from '@nestjs/testing';
import { PractitionerController } from './practitioner.controller';
import { PractitionerService } from './practitioner.service';

describe('PractitionerController', () => {
  let controller: PractitionerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PractitionerController],
      providers: [PractitionerService],
    }).compile();

    controller = module.get<PractitionerController>(PractitionerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
