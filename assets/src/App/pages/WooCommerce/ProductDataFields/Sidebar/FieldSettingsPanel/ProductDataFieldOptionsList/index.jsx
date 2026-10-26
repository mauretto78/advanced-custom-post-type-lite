import React from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from "react-redux";
import {arrayMove} from "@dnd-kit/sortable";
import {useFieldArray, useFormContext} from "react-hook-form";
import {v4 as uuidv4} from "uuid";
import useTranslation from "../../../../../../hooks/useTranslation";
import SortableList from "../../../../../../components/SortableList";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {addOption, setOptions} from "../../../../../../redux/reducers/productDataFieldsStateSlice";
import ProductDataFieldOption from "./ProductDataFieldOption";

const ProductDataFieldOptionsList = ({fieldIndex, fieldId, options, isMulti = false}) => {
    const documentGlobals = document.globals;
    const globals         = documentGlobals?.globals;

    // manage global state
    const dispatch = useDispatch();

    // auto-animate
    const [parent] = useAutoAnimate();

    // manage form state
    const {setValue, control: formControl} = useFormContext();

    const formId = () => `fields.${fieldIndex}.options`;

    const {move} = useFieldArray({
        control: formControl,
        name: formId(),
    });

    // ── Drag & drop reorder ───────────────────────────────────────────────
    const handleDragEnd = (event) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;

        const oldIndex      = options.findIndex(o => o.id === active.id);
        const newIndex      = options.findIndex(o => o.id === over.id);
        const sortedOptions = arrayMove(options, oldIndex, newIndex);

        move(oldIndex, newIndex);
        dispatch(setOptions({fieldIndex, sortedOptions}));
    };

    // ── Add option ────────────────────────────────────────────────────────
    const handleAddOption = () => {
        const option = {
            id:        uuidv4(),
            fieldId,
            label:     'label',
            value:     'value',
            isDefault: false,
        };
        dispatch(addOption({fieldIndex, option}));
    };

    // ── isDefault — only one can be active for single-select types ────────
    const handleIsDefault = ({id, checked}) => {
        if (isMulti) return;

        for (let i = 0; i < options.length; i++) {
            const optionId = `${formId()}.${i}.isDefault`;
            setValue(optionId, optionId === id ? checked : false);
        }
    };

    return (
        (<div>
            <label className="form-label">
                {useTranslation("Options")}
            </label>
            {options && options.length > 0 ? (
                <React.Fragment>
                    <div ref={parent} className="flex-column s-12">
                        <SortableList onDragEnd={handleDragEnd} items={options}>
                            {options.map((option, optionIndex) => (
                                <ProductDataFieldOption
                                    key={option.id}
                                    fieldId={fieldId}
                                    fieldIndex={fieldIndex}
                                    optionIndex={optionIndex}
                                    option={option}
                                    handleIsDefault={handleIsDefault}
                                />
                            ))}
                        </SortableList>
                    </div>
                    <div className="p-24 i-flex-center s-8">
                        <button
                            type="button"
                            className="btn-reset"
                            onClick={e => { e.preventDefault(); handleAddOption(); }}
                        >
                            {useTranslation("Add option")}
                        </button>

                    </div>
                </React.Fragment>
            ) : (
                <div className="mt-8 b-maxi bg-white b-rounded p-24 flex-column s-12 text-center">
                    <span>
                        {useTranslation('No options already created. Create the first one now by clicking the button "Add option"!')}
                    </span>
                    <div className="bg-white i-flex-center justify-center s-8">
                        <button
                            type="button"
                            className="btn-reset"
                            onClick={e => { e.preventDefault(); handleAddOption(); }}
                        >
                            {useTranslation("Add option")}
                        </button>

                    </div>
                </div>
            )}
        </div>)
    );
};

ProductDataFieldOptionsList.propTypes = {
    fieldIndex: PropTypes.number.isRequired,
    fieldId:    PropTypes.string.isRequired,
    options:    PropTypes.array.isRequired,
    isMulti:    PropTypes.bool,
};

export default ProductDataFieldOptionsList;
