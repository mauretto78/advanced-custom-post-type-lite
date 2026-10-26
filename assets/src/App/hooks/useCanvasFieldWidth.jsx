import {useSelector} from "react-redux";
import {metaFieldFormId} from "../utils/fields.jsx";
import useWatchedFieldValue from "./useWatchedFieldValue.jsx";

/**
 * Resolves a Meta Canvas field's live width percentage.
 *
 * The sidebar's "Field width" input is always registered at the fixed RHF
 * slot `advancedOptions.2.value` (see AdvancedTab/Settings/GeneralSettings.jsx),
 * regardless of where (or whether) a `width` entry sits in the backend's
 * `field.advancedOptions` array -- so that fixed path is watched
 * unconditionally. useWatchedFieldValue already falls back to widthFallback
 * when the path isn't registered/empty, so no field ever needs an explicit
 * saved width entry to live-update in the canvas.
 *
 * @param {object} field
 * @param {string} boxId
 * @returns {number|string} The resolved width percentage.
 */
const useCanvasFieldWidth = (field, boxId) => {
    const {group} = useSelector(state => state.metaState);

    const fp = (key) => boxId ? metaFieldFormId(group?.boxes ?? [], boxId, field.id, key) : '_noop_';

    const widthOption = (field.advancedOptions ?? []).find(o => o && o.key === 'width');
    const widthFallback = (widthOption && widthOption.value !== undefined && widthOption.value !== null && widthOption.value !== '')
        ? widthOption.value
        : 100;

    return useWatchedFieldValue(fp('advancedOptions.2.value'), widthFallback);
};

export default useCanvasFieldWidth;
