import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tier } from '../entities/Tier';

@Injectable()
export class TierRepository {
  constructor(
    @InjectRepository(Tier)
    private tierRepository: Repository<Tier>,
  ) {}

  async getTierData() {
    return await this.tierRepository.find();
  }
}
