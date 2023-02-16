import { ValueTransformer } from 'typeorm';

function isNullOrUndefined<T>(obj: T | null | undefined): boolean {
  return typeof obj === 'undefined' || obj === null;
}

export class BooleanTransformer implements ValueTransformer {
  from(dbValue?: number | null): boolean | undefined {
    if (isNullOrUndefined(dbValue)) {
      return;
    }
    return dbValue ? true : false;
  }

  to(value?: boolean | null): number | undefined {
    if (isNullOrUndefined(value)) {
      return;
    }
    return value ? 1 : 0;
  }
}
