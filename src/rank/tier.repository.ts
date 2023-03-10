import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tier } from '../entities/Tier';

@Injectable()
export class TierRepository {
  constructor(
    @InjectRepository(Tier)
    private tierRepository: Repository<Tier>,
  ) {}

  async getTierData(): Promise<Tier[]> {
    try {
      return await this.tierRepository.find();
    } catch (e) {
      throw new HttpException(
        'DATABASE SERVER CONNECTION ERROR',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
