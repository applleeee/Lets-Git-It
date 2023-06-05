export interface UserProps {
  githubId: number;
  fieldId: number;
  careerId: number;
  isAdmin: boolean;
  isKorean: boolean;
  hashedRefreshTokenId?: string;
}

export interface CreateUserProps {
  githubId: number;
  fieldId: number;
  careerId: number;
  isKorean: boolean;
}

export interface UpdateUserProps {
  fieldId: number;
  careerId: number;
  isKorean: boolean;
}
