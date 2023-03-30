import { ORDER } from '../../enums/field';

// search function: field search and search key
export const search = (searchField: string[] | string, searchKey?: string) => {
    if (searchKey) {
        const sKey = searchKey.replace(/([?*+[\]\\()|])/g, '');
        if (typeof searchField == 'string') searchField = [searchField];
        const search = searchField.map(field => {
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

export const filter = (searchField: string, searchKey?: string) => {
    if (searchKey) {
        const searchOptions = {};
        searchOptions[searchField] = searchKey;
        return searchOptions;
    }
    return {};
};

export const pagination = (limit?: string, offset?: string) => {
    if (limit == null || offset == null) return { limit: 0, offset: 0 };
    const limitInt = parseInt(Number(limit).toFixed(0));
    const offsetInt = parseInt(Number(offset).toFixed(0));
    if (
        typeof limitInt == 'number' &&
        typeof offsetInt == 'number' &&
        offsetInt >= 0 &&
        limitInt >= 0
    ) {
        const paginationOptions = { offset: offsetInt, limit: limitInt };
        return paginationOptions;
    }
    return { limit: 0, offset: 0 };
};
