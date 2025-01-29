import {usePrevious} from "./usePrevious";

export const useHasChanged = (val) => {
    const prevVal = usePrevious(val);

    return prevVal !== val
};