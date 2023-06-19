import { Field } from '../../database/entity/field.orm-entity';
import { Career } from '../../database/entity/career.orm-entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * @author MyeongSeok
 * @description 회원가입 시 유저에게 받아야 하는 정보의 카테고리를 반환하는 응답객체의 DTO입니다.
 */
export class UserCategoryDto {
  @Exclude() private readonly _field: Field[];
  @Exclude() private readonly _career: Career[];

  constructor({ fields, careers }) {
    this._field = fields;
    this._career = careers;
  }

  /**
   * 유저의 개발분야를 나타냅니다.
   * @example [{ id : 1, name : 프론트엔드 }, { id : 2, name : 백엔드 }, { id : 3, name : 안드로이드 }, { id : , name : IOS }, { id : 5, name : 운영체제 }, { id : 6, name : Q/A }, { id : 7, name : 임베디드 }, { id : 8, name : 보안}, { id : 9, name : 기타 }]
   */
  @ApiProperty({
    description: '유저의 개발분야를 나타냅니다',
    example: [
      { id: 1, name: '프론트엔드' },
      { id: 2, name: '백엔드' },
      { id: 3, name: '안드로이드' },
      { id: 4, name: 'IOS' },
      { id: 5, name: '운영체제' },
      { id: 6, name: 'Q/A' },
      { id: 7, name: '임베디드' },
      { id: 8, name: '보안' },
      { id: 9, name: '기타' },
    ],
    required: true,
  })
  @Expose()
  get field(): Field[] {
    return this._field;
  }

  /**
   * 유저의 개발경력을 나타냅니다.
   * @example [{ id : 1, period : 학생 }, { id : 2, period: 1년차 }, { id : 3, period : 2년차 }, { id : 4, period : 3년차}, { id : 5, period : 4년차 }, { id : 6, period  5년차 }, { id : 7, period : 6년차 }, { id : 8 ,period : 7년차 }, { id : 9, period : 8년차 }, { id : 10, period : 9년차 }, { id : 11,  period : 10년차 이상 }]
   */
  @ApiProperty({
    description: '유저의 개발경력을 나타냅니다',
    example: [
      { id: 1, period: '학생' },
      { id: 2, period: '1년차' },
      { id: 3, period: '2년차' },
      { id: 4, period: '3년차' },
      { id: 5, period: '4년차' },
      { id: 6, period: '5년차' },
      { id: 7, period: '6년차' },
      { id: 8, period: '7년차' },
      { id: 9, period: '8년차' },
      { id: 10, period: '9년차' },
      { id: 11, period: '10년차 이상' },
    ],
    required: true,
  })
  @Expose()
  get career(): Career[] {
    return this._career;
  }
}
