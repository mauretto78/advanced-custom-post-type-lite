import {useDispatch} from "react-redux";
import {useFormContext} from "react-hook-form";
import {canFieldHaveOptions} from "../constants/woocommerce_fields.jsx";
import {updateField} from "../redux/reducers/productDataFieldsStateSlice";

/**
 * Returns a `changeType(newType)` function that performs the canonical field-type-change
 * side effects (reset options/defaultValue as applicable, unregister stale RHF sub-paths,
 * dispatch updateField). Shared by the sidebar settings panel and the inline canvas type
 * editor so the two never drift apart.
 *
 * @param {{field: object, formId: (key: string) => string}} params
 * @returns {(newType: string) => void}
 */
const useProductFieldTypeChange = ({field, formId}) => {
    const dispatch = useDispatch();
    const {unregister} = useFormContext();

    return (newType) => {
        if (field.type === newType) return;

        const updated = {...field, type: newType};

        if (!canFieldHaveOptions(newType)) {
            updated.options = [];
            unregister(formId('options'));
        }

        updated.defaultValue = null;
        unregister(formId('defaultValue'));

        if (!updated.options) updated.options = [];

        dispatch(updateField({field: updated}));
    };
};

export default useProductFieldTypeChange;
