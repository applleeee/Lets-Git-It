import { IsOptional } from 'class-validator';

export class DeleteImageInS3RequestDto {
  @IsOptional()
  readonly toDeleteImage: string[];
}
