import {useFormContext, useWatch} from "react-hook-form";
import {slugify, transliterate} from "transliteration";
import {wpAjaxRequest} from "../utils/ajax";
import useTranslation from "./useTranslation";

/**
 * Returns an async RHF-compatible validate function that prevents duplicate field names
 * within the same box. The stored meta key is <box>_<field> and box names are unique
 * site-wide, so the same field name in another box is allowed (#1421/#1422). Shared by
 * the sidebar Basic tab and the inline canvas rename editor so both stay backed by the
 * same uniqueness check.
 *
 * @param {{boxIndex: number, fieldIndex: number, field: object}} params
 * @returns {(name: string) => Promise<string|undefined>}
 */
// fieldIndex is unused here (uniqueness is checked by field.id below) but kept for parity with sibling components that share this destructured shape
const useMetaFieldNameValidator = ({boxIndex, fieldIndex, field}) => {
    const {control} = useFormContext();
    const watchedFields  = useWatch({control, name: `boxes.${boxIndex}.fields`});
    const watchedBoxName = useWatch({control, name: `boxes.${boxIndex}.name`});

    return async (name) => {
        const slugified = slugify(transliterate(name));

        const otherFieldNames = [];
        (watchedFields ?? []).forEach((f) => {
            if (f && f.id !== field.id) {
                otherFieldNames.push((f.name ?? '').toLowerCase());
            }
        });

        if (otherFieldNames.includes(slugified)) {
            return useTranslation("No Meta field duplicate names are allowed");
        }

        // A brand-new, not-yet-persisted field (isSaved === false) is always checked
        // server-side: its in-memory name already equals its auto-slugged default at
        // creation time, so the "did the name change" gate below would otherwise never
        // fire and a colliding auto-generated name would slip through unchecked.
        if (field.isSaved === false || field.name.toLowerCase() !== slugified) {
            const res = await wpAjaxRequest("checkMetaBoxFieldNameAction", {
                fieldName: slugified,
                boxName: watchedBoxName,
                fieldId: field.id
            });

            if (res.exists === true) {
                return useTranslation("No Meta field duplicate names are allowed");
            }
        }
    };
};

export default useMetaFieldNameValidator;
