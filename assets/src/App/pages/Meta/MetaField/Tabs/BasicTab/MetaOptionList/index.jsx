import React from "react";
import PropTypes from 'prop-types';
import SortableList from "../../../../../../components/SortableList";
import useTranslation from "../../../../../../hooks/useTranslation";
import Alert from "../../../../../../components/Alert";
import {styleVariants} from "../../../../../../constants/styles";
import MetaOption from "./MetaOption";
import {v4 as uuidv4} from "uuid";
import {addOption} from "../../../../../../redux/reducers/metaStateSlice";
import {useDispatch, useSelector} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import {getFormId} from "../../../../../../utils/fields";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import LoadDatasetModal from "../../../../Modal/LoadDatasetModal";

const MetaOptionList = ({boxId, boxIndex, fieldIndex, fieldId, parentFieldId, options, isMulti}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    // auto-animate
    const [parent] = useAutoAnimate();

    // manage form state
    const formId = () => {
        return `${getFormId(group.boxes, boxId, fieldId)}.options`;
    };

    // manage form state
    const { control, setValue, resetField } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: formId(),
    });

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = options.findIndex((field) => field.id === active.id);
        const newIndex = options.findIndex((field) => field.id === over.id);
        move(oldIndex, newIndex);
    };

    /**
     * Add new option
     */
    const handleAddOption = () => {

        const option = {
            id: uuidv4(),
            boxId: boxId,
            fieldId: fieldId,
            label: 'label',
            value: 'value',
            isDefault: false,
        };

        dispatch(addOption({boxId, fieldId, parentFieldId, option}));
    };

    const handleIsDefault = ({id, checked}) => {
        if(isMulti){
            return;
        }

        for (let i = 0; i < options.length; i++) {
            const optionId = formId()+"."+i+".isDefault";
            if(optionId !== id){
                setValue(optionId, false);
            } else {
                setValue(optionId, checked);
            }
        }
    };

    return (
        <div className="mt-24">
            <fieldset className="acpt-fieldset">
                <legend>{useTranslation("Option list")}</legend>
                <div
                    ref={parent}
                    className="flex-column s-24"
                >
                    {options && options.length > 0 ? (
                        <SortableList
                            onDragEnd={handleDragEnd}
                            items={options}
                        >
                            {options && options.map((option, index) => (
                                <MetaOption
                                    index={index}
                                    boxIndex={boxIndex}
                                    fieldIndex={fieldIndex}
                                    boxId={boxId}
                                    fieldId={fieldId}
                                    parentFieldId={parentFieldId}
                                    option={option}
                                    handleIsDefault={handleIsDefault}
                                />
                            ))}
                        </SortableList>
                    ) : (
                        <Alert style={styleVariants.WARNING}>
                            {useTranslation('No options already created. Create the first one now by clicking the button "Add option"!')}
                        </Alert>
                    )}
                </div>
                <div className="mt-24 i-flex-center s-8">
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            handleAddOption();
                        }}
                    >
                        {useTranslation("Add option")}
                    </a>
                    <LoadDatasetModal
                        boxId={boxId}
                        fieldId={fieldId}
                        parentFieldId={parentFieldId}
                    />
                </div>
            </fieldset>
        </div>
    );
};

MetaOptionList.propTypes = {
    boxId: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    parentFieldId: PropTypes.string,
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    options: PropTypes.array.isRequired,
    isMulti: PropTypes.bool.isRequired,
};

export default MetaOptionList;