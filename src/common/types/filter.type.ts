import { STATUS } from '../enums/status';
class FilterOption {
    field: string;
    isId: boolean;
}
export class FilterOptionId extends FilterOption {
    value: number;
}
export class FilterStatus extends FilterOption {
    value: STATUS;
}
export type FilterOptions = (FilterOptionId | FilterStatus)[];
