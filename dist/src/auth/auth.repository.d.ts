import { Repository } from 'typeorm';
import { Career } from '../entities/Career';
import { Field } from 'src/entities/Field';
export declare class AuthRepository {
    private readonly careerRepository;
    private readonly fieldRepository;
    constructor(careerRepository: Repository<Career>, fieldRepository: Repository<Field>);
    getAuthCategory(): Promise<{
        field: Field[];
        career: Career[];
    }>;
}
