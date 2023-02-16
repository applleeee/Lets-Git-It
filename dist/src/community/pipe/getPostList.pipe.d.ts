import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ValidateSubCategoryIdPipe implements PipeTransform {
    transform(value: number, metadata: ArgumentMetadata): Promise<number>;
}
