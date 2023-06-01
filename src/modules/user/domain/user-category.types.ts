import { UserCareerEntity } from './user-category-career.entity';
import { UserFieldEntity } from './user-category-field.entity';

export enum FieldName {
  '프론트엔드' = 1,
  '백엔드',
  '안드로이드',
  'IOS',
  '운영체제',
  'Q/A',
  '임베디드',
  '보안',
  '기타',
}

export enum CareerPeriod {
  '학생' = 1,
  '1년차',
  '2년차',
  '3년차',
  '4년차',
  '5년차',
  '6년차',
  '7년차',
  '8년차',
  '9년차',
  '10년차 이상',
}

export interface FieldProps {
  name: FieldName;
}

export interface CareerProps {
  period: CareerPeriod;
}
export interface UserCategoryEntity {
  field: UserFieldEntity[];
  career: UserCareerEntity[];
}
