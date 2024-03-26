import React from 'react';
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import {v4 as uuidv4} from "uuid";
import {addOption} from "../../../../../redux/reducers/productDataFieldsStateSlice";
import useTranslation from "../../../../../hooks/useTranslation";
import Alert from "../../../../../components/Alert";
import {styleVariants} from "../../../../../constants/styles";
import SortableList from "../../../../../components/SortableList";
import ProductDataFieldOption from "./ProductDataFieldOption";

const ProductDataFieldOptionsList = ({fieldId, fieldIndex, options}) => {

    // manage global state
    const dispatch = useDispatch();

    // manage form state
    const formId = () => {
        return `fields.${fieldIndex}.options`;
    };

    // manage form state
    const { control } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: formId(),
    });

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = options.findIndex((option) => option.id === active.id);
        const newIndex = options.findIndex((option) => option.id === over.id);
        move(oldIndex, newIndex);
    };

    /**
     * Add new option
     */
    const handleAddOption = () => {

        const option = {
            id: uuidv4(),
            fieldId: fieldId,
            label: 'option',
            value: 'option'
        };

        dispatch(addOption({fieldIndex, option}));
    };

    return (
        <div>
            <fieldset className="acpt-fieldset">
                <legend>{useTranslation("Option list")}</legend>
                {options && options.length > 0 ? (
                    <SortableList
                        onDragEnd={handleDragEnd}
                        items={options}
                    >
                        <div className="flex-column s-24">
                            {options && options.map((option, index) => (
                                <ProductDataFieldOption
                                    index={index}
                                    fieldIndex={fieldIndex}
                                    fieldId={fieldId}
                                    option={option}
                                />
                            ))}
                        </div>
                    </SortableList>
                ) : (
                    <Alert style={styleVariants.WARNING}>
                        {useTranslation('No options already created. Create the first one now by clicking the button "Add option"!')}
                    </Alert>
                )}
                <a
                    href="#"
                    className="mt-24"
                    onClick={e => {
                        e.preventDefault();
                        handleAddOption();
                    }}
                >
                    {useTranslation("Add option")}
                </a>
            </fieldset>
        </div>
    );
};

ProductDataFieldOptionsList.propTypes = {
    fieldId: PropTypes.string.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    options: PropTypes.array.isRequired,
};

export default ProductDataFieldOptionsList;