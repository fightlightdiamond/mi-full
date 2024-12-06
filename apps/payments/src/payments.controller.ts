import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { CREATE_CHARGE_PATTERN } from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern(CREATE_CHARGE_PATTERN)
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: PaymentsCreateChargeDto) {
    console.log('------CREATE_CHARGE_PATTERN---------');
    return this.paymentsService.createCharge(data);
  }
}
