export type PaginationOptions = {
    limit: number;
    offset: number;
};

export type QueryOptions = {
    searchOptions?: object;
    filterOptions?: object;
    relationOptions?: object;
    selectOptions?: object;
    paginationOptions?: PaginationOptions;
    sortOptions?: object;
};
