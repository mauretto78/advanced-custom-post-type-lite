import {filterByLabel, isEmpty} from "./objects.jsx";

/**
 * Calculates and returns pagination details based on the total number of items,
 * the limit per page, and the current page number.
 *
 * @param {number} page - The current page number (1-based index).
 * @param {number} total - The total number of items to paginate.
 * @returns {Object} An object containing pagination details, including:
 * - total: The total number of items.
 * - page: The current page number.
 * - prevPage: The previous page number, or null if there is no previous page.
 * - nextPage: The next page number, or null if there is no next page.
 * - start: The starting index of the items for the current page.
 * - end: The ending index of the items for the current page.
 * - totalPages: The total number of pages.
 * - pageSize: The number of items per page, derived from settings or defaulting to 20 if not specified.
 */

export const getPagination = (page, total) => {

    if(typeof page !== 'number' || typeof total !== 'number'){
        return null;
    }

    const pageSize = getPageSize();
    const totalPages = Math.ceil( total / pageSize );

    // Clamp out-of-range page numbers (e.g. a "0" or negative value coming
    // from a truthy URL param string, or a stale/bookmarked page number that
    // no longer exists after the underlying data shrank) so start/end never
    // go negative or past the last valid page.
    page = Math.min(Math.max(page, 1), totalPages > 0 ? totalPages : 1);

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    const pageIndex = page - 1;
    const start = total === 0 ? 0 : pageIndex * pageSize + 1;
    const end = Math.min(start + pageSize - 1, total);

    return {total, page, prevPage, nextPage, start, end, totalPages, pageSize, pageIndex};
};

/**
 *
 * @returns {*|number}
 */
export const getPageSize = () => {
    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;
    const foundSetting = filterByLabel(settings, 'key', 'records_per_page');
    const pageSize = (settings?.length > 0 && !isEmpty(foundSetting)) ? foundSetting.value : 20;

    return parseInt(pageSize);
};