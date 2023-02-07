import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from '../entities/Ranking';

@Injectable()
export class RankingRepository {
  constructor(
    @InjectRepository(Ranking)
    private rankingRepository: Repository<Ranking>,
  ) {}

  async getAllScores() {
    return await this.rankingRepository
      .createQueryBuilder()
      .select('total_score')
      .getRawMany();
  }
}
