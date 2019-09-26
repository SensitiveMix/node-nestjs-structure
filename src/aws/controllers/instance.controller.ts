import { BadRequestException, Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { DescribeInstancesResult, DescribeInstanceStatusResult } from 'aws-sdk/clients/ec2';

import { EC2Service } from '../providers/ec2.service';

/**
 * AWS EC2 Instance
 */
@Controller('instance')
export class InstanceController {
  constructor(private readonly instance: EC2Service) {}

  @Get('list')
  public async list() {
    const result: DescribeInstancesResult = await this.instance.describeInstances();

    if (!result.Reservations) {
      throw new NotFoundException('NotFoundReservations');
    }

    return result.Reservations;
  }

  @Post('status')
  public async status(@Body('ids') ids: string[]) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('InvalidParameter');
    }

    const result: DescribeInstanceStatusResult = await this.instance.describeInstanceStatus(ids);
    if (!result.InstanceStatuses) {
      throw new NotFoundException('NotFoundInstanceStatuses');
    }

    return result.InstanceStatuses;
  }
}