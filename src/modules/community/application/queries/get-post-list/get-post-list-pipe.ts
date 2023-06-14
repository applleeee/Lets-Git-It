import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidateSubCategoryIdPipe implements PipeTransform {
  async transform(value: number, metadata: ArgumentMetadata) {
    enum subCategoryIdMinMax {
      min = 1,
      max = 8,
    }
    if (
      Number.isNaN(value) ||
      value < subCategoryIdMinMax.min ||
      value > subCategoryIdMinMax.max
    ) {
      throw new BadRequestException('Invalid subCategoryId');
    }
    return value;
  }
}
