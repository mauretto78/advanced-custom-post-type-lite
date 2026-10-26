import {useFormContext, useWatch} from "react-hook-form";
import {slugify, transliterate} from "transliteration";
import useTranslation from "./useTranslation";

/**
 * Returns an RHF-compatible validate function that prevents duplicate product-data-field
 * name collisions. Shared by the sidebar settings panel and the inline canvas rename editor
 * so both stay backed by the same uniqueness check.
 *
 * @param {{index: number}} params
 * @returns {(name: string) => string|undefined}
 */
const useProductFieldNameValidator = ({index}) => {
    const {control: formControl} = useFormContext();
    const watchedFields = useWatch({formControl, name: 'fields'});

    return (name) => {
        const slugified  = slugify(transliterate(name));
        const otherNames = (watchedFields ?? [])
            .filter((_, i) => i !== index)
            .map(f => f?.name);

        if (otherNames.includes(slugified)) {
            return useTranslation('Name is already taken');
        }
    };
};

export default useProductFieldNameValidator;
