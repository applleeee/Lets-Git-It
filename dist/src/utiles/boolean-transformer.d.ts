import { ValueTransformer } from 'typeorm';
export declare class BooleanTransformer implements ValueTransformer {
    from(dbValue?: number | null): boolean | undefined;
    to(value?: boolean | null): number | undefined;
}
