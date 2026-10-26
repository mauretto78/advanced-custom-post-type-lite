import {useFormContext, useWatch} from "react-hook-form";
import {slugify, transliterate} from "transliteration";
import {wpAjaxRequest} from "../utils/ajax";
import useTranslation from "./useTranslation";

/**
 * Returns an async RHF-compatible validate function that prevents duplicate box-name
 * collisions site-wide (box names must be globally unique, matching 2.0.67 behaviour —
 * getMetaFieldByName() resolves values by box name with no group scope). Shared by the
 * sidebar BoxSettingsPanel and the inline canvas rename editor so both stay backed by
 * the same uniqueness check.
 *
 * @param {{boxIndex: number, box: object}} params
 * @returns {(name: string) => Promise<string|undefined>}
 */
const useMetaBoxNameValidator = ({boxIndex, box}) => {
    const {control} = useFormContext();
    const watchedBoxes = useWatch({control, name: 'boxes'});

    return async (name) => {
        const slugified = slugify(transliterate(name));

        const otherBoxNames = (watchedBoxes ?? [])
            .filter((_, i) => i !== boxIndex)
            .map(b => b?.name?.toLowerCase());

        if (otherBoxNames.includes(slugified)) {
            return useTranslation("No Meta box duplicate names are allowed");
        }

        // Only skip the server check for a box that's already persisted AND whose name
        // hasn't changed — existsMetaBox() returns true on a single exact match, which
        // would false-positive an unchanged existing box. A brand-new box (isSaved ===
        // false) is always checked: its in-memory name already equals its auto-slugged
        // default at creation time, so this gate would otherwise never fire for it and a
        // colliding auto-generated name would slip through unchecked.
        if (box.isSaved === false || box.name?.toLowerCase() !== slugified) {
            const res = await wpAjaxRequest("checkMetaBoxNameAction", {boxName: slugified});

            if (res?.exists === true) {
                return useTranslation("No Meta box duplicate names are allowed");
            }
        }
    };
};

export default useMetaBoxNameValidator;
