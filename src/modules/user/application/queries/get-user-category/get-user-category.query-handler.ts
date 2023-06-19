import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserCategoryQuery } from './get-user-category.query';
import { USER_CATEGORY_REPOSITORY } from 'src/modules/user/user.di-tokens';
import { UserCategoryMapper } from 'src/modules/user/mapper/user-category.mapper';
import { UserCategoryRepositoryPort } from 'src/modules/user/database/user-category.repository.port';
import { UserCategoryDto } from '../../dtos/user-category.response.dto';

@Injectable()
@QueryHandler(GetUserCategoryQuery)
export class GetUserCateGoryQueryHandler
  implements IQueryHandler<GetUserCategoryQuery>
{
  constructor(
    @Inject(USER_CATEGORY_REPOSITORY)
    private readonly _userCategoryRepository: UserCategoryRepositoryPort,
    private readonly _mapper: UserCategoryMapper,
  ) {}

  async execute(query: GetUserCategoryQuery): Promise<UserCategoryDto> {
    const userCategoryEntity =
      await this._userCategoryRepository.getUserCategory();
    return this._mapper.toResponse(userCategoryEntity);
  }
}
