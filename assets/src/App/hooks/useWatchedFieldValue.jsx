import {useWatch, useFormContext} from "react-hook-form";

/**
 * Watches a RHF field value and falls back to a static value when empty.
 *
 * @param {string} formPath  - The RHF field path, e.g. "boxes.0.fields.0.label"
 * @param {*}      fallback  - Fallback value (typically from the Redux field object)
 * @returns {*} The watched value if non-empty, otherwise the fallback.
 */
const useWatchedFieldValue = (formPath, fallback) => {
    const {control} = useFormContext();
    const watched = useWatch({control, name: formPath || '_noop_'});

    if (!formPath || formPath === '_noop_') return fallback;

    return (watched !== undefined && watched !== null && watched !== '')
        ? watched
        : fallback;
};

export default useWatchedFieldValue;

