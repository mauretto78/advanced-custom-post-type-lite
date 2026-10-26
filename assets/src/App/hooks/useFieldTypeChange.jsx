import {useDispatch} from "react-redux";
import {useFormContext} from "react-hook-form";
import {canFieldHaveValidationAndLogicRules} from "../utils/fields.jsx";
import {updateField} from "../redux/reducers/metaStateSlice.jsx";

/**
 * Returns a `changeType(newType)` function that performs the canonical field-type-change
 * side effects (reset children/blocks/relations/validationRules as applicable, unregister
 * stale RHF sub-paths, dispatch updateField). Shared by the sidebar Basic tab and the
 * inline canvas type editor so the two never drift apart.
 *
 * @param {{boxId: string, field: object, formId: (key: string) => string}} params
 * @returns {(newType: string) => void}
 */
const useFieldTypeChange = ({boxId, field, formId}) => {
    const dispatch = useDispatch();
    const {unregister} = useFormContext();

    return (newType) => {
        if (field.type === newType) return;

        const updatedField = {...field, type: newType};

        updatedField.children = [];
        updatedField.blocks = [];
        updatedField.relations = [];

        if (!canFieldHaveValidationAndLogicRules(newType)) {
            unregister(formId("validationRules"));
            updatedField.validationRules = [];
        }

        unregister(formId("relations"));
        unregister(formId("blocks"));
        unregister(formId("children"));

        if (!updatedField.children)             updatedField.children = [];
        if (!updatedField.blocks)               updatedField.blocks = [];
        if (!updatedField.relations)            updatedField.relations = [];
        if (!updatedField.visibilityConditions) updatedField.visibilityConditions = [];
        if (!updatedField.validationRules)      updatedField.validationRules = [];

        dispatch(updateField({field: updatedField, boxId}));
    };
};

export default useFieldTypeChange;
