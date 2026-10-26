// useTableQueryState.js
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'react-router-dom';

export const useTableQueryState = ({ debounceSearch = 300 } = {}) => {

    const [searchParams, setSearchParams] = useSearchParams();

    const [searchValue, setSearchValue] = useState(() => {
        return searchParams.get('search') || '';
    });

    const [contextValue, setContextValue] = useState(() => {
        return searchParams.get('context') || null;
    });

    const state = useMemo(() => {
        return {
            sortKey: searchParams.get('sort'),
            sortOrder: searchParams.get('order') || 'asc',
            search: searchParams.get('search') || '',
            context: searchParams.get('context') || null
        };
    }, [searchParams]);

    const update = useCallback((newParams = {}, { resetPage = true } = {}) => {
        const params = new URLSearchParams(searchParams);

        Object.entries(newParams).forEach(([key, value]) => {
            if (!value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        if (resetPage) {
            const parts = window.location.hash.split('?')[0].split('/').filter(Boolean);
            const last = parts[parts.length - 1];

            if (!isNaN(last)) {
                parts.pop();
                window.location.hash = '/' + parts.join('/');
            }
        }

        setSearchParams(params);

        // trigger custom event (for backward compatibility or other listeners)
        window.dispatchEvent(new Event('table:queryChange'));
    }, [searchParams, setSearchParams]);

    const setSort = useCallback((key) => {
        if (!key) return;

        const currentKey = searchParams.get('sort');
        const currentOrder = searchParams.get('order') || 'asc';

        const newOrder = currentKey === key && currentOrder === 'asc' ? 'desc' : 'asc';

        update({ sort: key, order: newOrder });
    }, [update, searchParams]);

    // sync contextValue and searchValue with URL params
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        const urlContext = searchParams.get('context') || null;

        if (contextValue !== urlContext) {
            setContextValue(urlContext);
        }

        if (searchValue !== urlSearch) {
             setSearchValue(urlSearch);
        }
    }, [searchParams]); // Remove searchValue from dependencies to avoid loop

    // debounce search
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        if (searchValue === urlSearch) return;

        const timeout = setTimeout(() => {
            update({ search: searchValue, context: contextValue });
        }, debounceSearch);

        return () => clearTimeout(timeout);
    }, [searchValue, update, searchParams, debounceSearch]);

    // update context
    useEffect(() => {
        const urlContext = searchParams.get('context') || null;
        if (contextValue === urlContext) return;
        update({ search: searchValue, context: contextValue });

    }, [contextValue]);

    return {
        ...state,
        searchValue,
        setSearchValue,
        contextValue,
        setContextValue,
        setSort
    };
};
