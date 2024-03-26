import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../../../hooks/useTranslation";
import {styleVariants} from "../../../../../constants/styles";
import Alert from "../../../../../components/Alert";
import ValidationRule from "./ValidationRule";
import {useDispatch} from "react-redux";
import {addValidationRule} from "../../../../../redux/reducers/metaStateSlice";
import {v4 as uuidv4} from "uuid";
import {useAutoAnimate} from "@formkit/auto-animate/react";

const ValidationRulesTab = ({boxIndex, fieldIndex, boxId, field, formId,  parentFieldIndex, parentFieldId}) => {

    // manage global state
    const dispatch = useDispatch();

    // auto-animate
    const [parent] = useAutoAnimate();

    const handleAddRule = () => {

        const rule = {
            id: uuidv4(),
            condition: '=',
            value: '',
        };

        dispatch(addValidationRule({boxId, fieldId: field.id, parentFieldId, rule}));
    };

    return (
        <div
            ref={parent}
            className={field.validationRules && field.validationRules.length > 0 ? 'flex-column s-24' : ''}
        >
            {field.validationRules && field.validationRules.length > 0 ? (
                <React.Fragment>
                    {field.validationRules.map((rule, index) => (
                        <ValidationRule
                            formId={formId}
                            boxId={boxId}
                            fieldId={field.id}
                            fieldIndex={fieldIndex}
                            rule={rule}
                            boxIndex={boxIndex}
                            parentFieldIndex={parentFieldIndex}
                            parentFieldId={parentFieldId}
                            ruleIndex={index}
                        />
                    ))}
                </React.Fragment>
            ) : (
                <Alert style={styleVariants.WARNING}>
                    {useTranslation('No rules already created. Create the first one now by clicking the button "Add rule"!')}
                </Alert>
            )}
            <a
                href="#"
                className={field.validationRules && field.validationRules.length > 0 ? '' : 'mt-24'}
                onClick={e => {
                    e.preventDefault();
                    handleAddRule();
                }}
            >
                {useTranslation("Add rule")}
            </a>
        </div>
    );
};

ValidationRulesTab.propTypes = {
    formId: PropTypes.func.isRequired,
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
};

export default ValidationRulesTab;