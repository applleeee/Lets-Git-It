import { CareerId, FieldId } from './user-category.types';

export interface UserProps {
  githubId: number;
  fieldId: FieldId;
  careerId: CareerId;
  isAdmin: boolean;
  isKorean: boolean;
  refreshTokenId?: string;
}

export interface CreateUserProps {
  githubId: number;
  fieldId: FieldId;
  careerId: CareerId;
  isKorean: boolean;
}

export interface UpdateUserProps {
  fieldId: FieldId;
  careerId: CareerId;
  isKorean: boolean;
}

export interface UpdateUserRefreshTokenIdProps {
  refreshTokenId: string;
}
