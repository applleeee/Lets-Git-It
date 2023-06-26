import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { CareerId, FieldId } from '../../domain/user-category.types';

/**
 * @author MyeongSeok
 * @description User 도메인 응답 dto 입니다.
 */

export class UserResponseDto {
  @Exclude() private readonly _id: string;
  @Exclude() private readonly _githubId: number;
  @Exclude() private readonly _fieldId: FieldId;
  @Exclude() private readonly _careerId: CareerId;
  @Exclude() private readonly _isAdmin: boolean;
  @Exclude() private readonly _isKorean: boolean;

  constructor({ id, githubId, fieldId, careerId, isAdmin, isKorean }) {
    this._id = id;
    this._githubId = githubId;
    this._fieldId = fieldId;
    this._careerId = careerId;
    this._isAdmin = isAdmin;
    this._isKorean = isKorean;
  }

  /**
   * todo 설명 추가
   * @example
   */
  @ApiProperty({
    example: '',
    description: '',
    required: true,
  })
  @Expose()
  get id(): string {
    return this._id;
  }

  /**
   * todo 설명 추가
   * @example
   */
  @ApiProperty({
    example: '',
    description: '',
    required: true,
  })
  @Expose()
  get githubId(): number {
    return this._githubId;
  }

  /**
   * todo 설명 추가
   * @example
   */
  @ApiProperty({
    example: '',
    description: '',
    required: true,
  })
  @Expose()
  get fieldId(): FieldId {
    return this._fieldId;
  }

  /**
   * todo 설명 추가
   * @example
   */
  @ApiProperty({
    example: '',
    description: '',
    required: true,
  })
  @Expose()
  get careerId(): CareerId {
    return this._careerId;
  }

  /**
   * todo 설명 추가
   * @example
   */
  @ApiProperty({
    example: '',
    description: '',
    required: true,
  })
  @Expose()
  get isAdmin(): boolean {
    return this._isAdmin;
  }

  /**
   * todo 설명 추가
   * @example
   */
  @ApiProperty({
    example: '',
    description: '',
    required: true,
  })
  @Expose()
  get isKorean(): boolean {
    return this._isKorean;
  }
}
