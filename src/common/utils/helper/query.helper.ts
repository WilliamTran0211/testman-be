import { FilterOptions } from 'src/common/types/filter.type';
import { PaginationOptions } from 'src/common/types/query.type';
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
export const customSort = ({
    sort,
    order
}: {
    sort?: USERS_FILED;
    order?: ORDER;
}) => {
    if (!order || !sort) {
        return { createdAt: ORDER.DESC };
    }
    const sortOption = {};
    if (sort === USERS_FILED.ROLE) {
        sortOption[sort] = { name: order };
        return sortOption;
    }
    sortOption[sort] = order;
    return sortOption;
};

export const customFilter = (filterOptions: FilterOptions) => {
    const filter = {};
    if (!filterOptions || filterOptions.length === 0) return filter;
    filterOptions.forEach(filterOption => {
        const { field, value, isId } = filterOption;
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
        if ([USERS_FILED.ROLE, USERS_FILED.AVATAR].includes(field))
            relationOptions[field] = true;
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
}): PaginationOptions => {
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
