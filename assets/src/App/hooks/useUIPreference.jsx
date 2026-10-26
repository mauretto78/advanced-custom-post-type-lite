import {useState} from 'react';

const SESSION_TEMP_ID_KEY = 'acpt_temp_table_id';

const getTempId = () => {
    // reuse the same temp id within the same browser session
    let tempId = sessionStorage.getItem(SESSION_TEMP_ID_KEY);
    if (!tempId) {
        tempId = `new_${Date.now()}`;
        sessionStorage.setItem(SESSION_TEMP_ID_KEY, tempId);
    }
    return tempId;
};

const buildKey = (tableId, preferenceKey) => {
    const resolvedId = tableId ?? getTempId();
    return `acpt_${resolvedId}_${preferenceKey}`;
};

const useUIPreference = (tableId, preferenceKey, defaultValue) => {
    const storageKey = buildKey(tableId, preferenceKey);

    const [value, setValue] = useState(() => {
        const stored = localStorage.getItem(storageKey);
        return stored !== null ? JSON.parse(stored) : defaultValue;
    });

    const set = (next) => {
        const resolved = typeof next === 'function' ? next(value) : next;
        localStorage.setItem(storageKey, JSON.stringify(resolved));
        setValue(resolved);
    };

    const toggle = () => set(prev => !prev);

    return {value, set, toggle};
};

export default useUIPreference;