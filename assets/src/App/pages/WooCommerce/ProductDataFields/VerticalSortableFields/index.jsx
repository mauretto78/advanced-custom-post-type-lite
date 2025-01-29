import React, {useState} from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../../hooks/useTranslation";
import Button from "../../../../components/Button";
import {styleVariants} from "../../../../constants/styles";
import {v4 as uuidv4} from "uuid";
import {TEXT} from "../../../../constants/woocommerce_fields";
import {addField, selectElement, setFields} from "../../../../redux/reducers/productDataFieldsStateSlice";
import {delay} from "../../../../utils/misc";
import {scrollToId} from "../../../../utils/scroll";
import {useDispatch} from "react-redux";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import SortableList from "../../../../components/SortableList";
import ProductDataField from "../ProductDataField";
import {useFieldArray, useFormContext} from "react-hook-form";
import {arrayMove} from "@dnd-kit/sortable";
import BulkActions from "../../BulkActions";
import {isNavigationEnabled, toggleNavigation} from "../../../../utils/localStorage";
import QuickNavigation from "../QuickNavigation";

const VerticalSortableFields = ({fields}) => {

    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;
    const globals = documentGlobals.globals;

    // auto-animate
    const [parent] = useAutoAnimate();

    // manage global state
    const dispatch = useDispatch();

    // manage form state
    const { control } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: "fields",
    });

    const navigationLocalStorageKey = "wp_product_data";
    const [isNavigationVisible, setIsNavigationVisible] = useState(isNavigationEnabled(navigationLocalStorageKey));

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);
        const sortedFields = arrayMove(fields, oldIndex, newIndex);
        move(oldIndex, newIndex);

        dispatch(setFields(sortedFields));
    };

    /**
     * Handle select/deselect all fields
     */
    const handleSelectAllFields = (checked) => {
        fields && fields.map((f) => {
            dispatch(selectElement({
                    element: f,
                    selected: checked
                }
            ));
        });
    };

    const handleAddField = () => {

        const newFieldId = uuidv4();
        const newField = {
            id: newFieldId,
            name: 'field',
            type: TEXT,
            isRequired: false,
            description: null,
            defaultValue: null,
            options: [],
        };

        dispatch(addField({field: newField}));

        delay(1).then(()=>{
            scrollToId(newFieldId);
        });
    };

    const handleToggleNavigation = (checked) => {
        toggleNavigation(navigationLocalStorageKey, checked);
        setIsNavigationVisible(!isNavigationVisible);
    };

    return (
        <React.Fragment>
            <div className={`flex-between s-8 ${fields.length === 0 ? " mb-12" : ""}`}>
                <div className="i-flex-center s-8">
                    <h3>
                        {useTranslation("product data fields")}
                    </h3>
                    <span className="px-8 py-4 font-sm bg-light-gray text-normal b-rounded">
                        {fields.length > 0 ? fields.length : 0}
                    </span>
                </div>
                {fields.length > 0 && (
                    <div className="i-flex-center s-8 mb-24">
                        <div className="toggle-group">
                            <label
                                htmlFor="toggle_navigation"
                                className="toggle"
                            >
                                <input
                                    id="toggle_navigation"
                                    type="checkbox"
                                    checked={isNavigationVisible}
                                    onChangeCapture={(e)=>{
                                        handleToggleNavigation(e.target.checked);
                                    }}
                                />
                                <span className="slider round"/>
                            </label>
                        </div>
                        <label
                            className="cursor-pointer"
                            htmlFor="toggle_navigation"
                        >
                            {useTranslation(isNavigationVisible ? "Hide navigation" : "Show navigation")}
                        </label>
                    </div>
                )}
            </div>
            <BulkActions />
            {fields && fields.length > 0 ? (
                <div className="container">
                    {isNavigationVisible && (
                        <div className="col-3 flex-column s-24 hidden-xs sticky" style={{
                            top: "130px"
                        }}>
                            <QuickNavigation fields={fields}/>
                        </div>
                    )}
                    <div className={`flex-column s-24 ${isNavigationVisible ? "col-9" : "col-12"}`}>
                        <div className={`responsive with-shadow b-rounded`}>
                            <table className={`acpt-table  ${globals.is_rtl ? 'rtl' : ''}`}>
                                <thead>
                                <tr>
                                    <th style={{width: "10px"}}>
                                        <label className="checkbox" htmlFor={`select-fields`} style={{marginLeft: "26px"}}>
                                            <input
                                                id={`select-fields`}
                                                type="checkbox"
                                                onChange={e => {
                                                    handleSelectAllFields(e.target.checked);
                                                }}
                                            />
                                            <span/>
                                        </label>
                                    </th>
                                    <th>
                                        {useTranslation("Name")}
                                    </th>
                                    <th>
                                        {useTranslation("Type")}
                                    </th>
                                    <th>
                                        {useTranslation("Actions")}
                                    </th>
                                </tr>
                                </thead>
                                <tbody ref={parent}>
                                    <SortableList
                                        onDragEnd={handleDragEnd}
                                        items={fields}
                                    >
                                        {fields && fields.map((field, fieldIndex) => (
                                            <ProductDataField
                                                field={field}
                                                index={fieldIndex}
                                            />
                                        ))}
                                    </SortableList>
                                </tbody>
                            </table>
                            <div className="p-24 bg-white">
                                <Button
                                    type="button"
                                    style={styleVariants.SECONDARY}
                                    onClick={e => {
                                        e.preventDefault();
                                        handleAddField();
                                    }}
                                >
                                    {useTranslation("Add field")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-24 p-24 bg-white with-shadow">
                    <div
                        className={`b-maxi b-rounded p-24 flex-column s-12 text-center`}
                    >
                        <span>
                            {useTranslation('No fields already created. Create the first one now by clicking the button "Add field"!')}
                        </span>
                        <div>
                            <Button
                                type="button"
                                style={styleVariants.SECONDARY}
                                onClick={e => {
                                    e.preventDefault();
                                    handleAddField();
                                }}
                            >
                                {useTranslation("Add field")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

VerticalSortableFields.propTypes = {
    fields: PropTypes.array.isRequired,
};

export default VerticalSortableFields;