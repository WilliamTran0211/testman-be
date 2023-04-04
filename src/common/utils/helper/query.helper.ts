import { FilterOptions } from 'src/common/types/filter.type';
import {
    ORDER,
    USERS_FILED,
    USERS_SEARCH_FIELD
} from '../../enums/fields.enum';

// search function: field search and search key
export const search = ({
    searchFields,
    searchKey
}: {
    searchFields: USERS_SEARCH_FIELD[];
    searchKey: string;
}) => {
    if (searchKey) {
        const sKey = searchKey.replace(/([?*+[\]\\()|])/g, '');
        const search = searchFields.map(field => {
            const searchOptions = {};
            searchOptions[field] = { $regex: new RegExp(sKey), $options: 'i' };
            return searchOptions;
        });
        return { $or: search };
    }
    return {};
};

//sort function: order is field sorting and dir is direction of sorting
export const sort = (order?: string, dir?: string) => {
    const sort = {};
    if (order && dir) sort[order] = dir == ORDER.DESC ? -1 : 1;
    return sort;
};

export const customFilter = (filterOptions: FilterOptions) => {
    const filter = {};
    if (!filterOptions || filterOptions.length === 0) return filter;
    filterOptions.forEach(filterOption => {
        const { field, value, isId } = filterOption;
        const filter = value;
        if (value && !isId) filter[field] = value;
        if (value && isId) filter[field] = { id: value };
    });
    return filter;
};

export const customSelectedFields = (selectedFields: USERS_FILED[]) => {
    const selectOptions = { id: true };
    const relationOptions = {};
    if (!selectedFields || selectedFields.length === 0)
        return { selectOptions, relationOptions };
    selectedFields.forEach(field => {
        if (field === USERS_FILED.ROLE) relationOptions[field] = true;
        selectOptions[field] = true;
    });
    return { selectOptions, relationOptions };
};

export const pagination = ({
    limit,
    offset
}: {
    limit?: number;
    offset?: number;
}) => {
    if (limit == undefined || offset == undefined)
        return { limit: 0, offset: 0 };
    if (limit > 0 && offset > 0) {
        const paginationOptions = {
            offset: (offset - 1) * limit,
            limit: limit
        };
        return paginationOptions;
    }
    return { offset: 0, limit: 0 };
};
