import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserCategoryQuery } from './get-user-category.query';
import { USER_CATEGORY_REPOSITORY } from 'src/modules/user/user.di-tokens';
import { Mapper } from 'src/libs/base/mapper.interface';
import { UserCategoryMapper } from 'src/modules/user/mapper/user-category.mapper';

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

  async execute(query: GetUserCategoryQuery): Promise<any> {
    return await this._userCategoryRepository.getUserCategory();
    // todo mapper로 dto로 만들어서 반환.
  }
}
