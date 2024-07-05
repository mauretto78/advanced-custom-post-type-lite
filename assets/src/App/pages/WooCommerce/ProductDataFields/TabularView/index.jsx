import React from 'react';
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import {arrayMove} from "@dnd-kit/sortable";
import {setFields} from "../../../../redux/reducers/productDataFieldsStateSlice";
import useTranslation from "../../../../hooks/useTranslation";
import SwitchView from "../../../../components/SwitchView";
import Alert from "../../../../components/Alert";
import {styleVariants} from "../../../../constants/styles";
import ProductDataField from "../ProductDataField";
import SortableList from "../../../../components/SortableList";
import ProductDataFieldSortableTab from "./ProductDataFieldSortableTab";
import BulkActions from "../../BulkActions";

const TabularView = ({fields, view, setView, activeTab, setActiveTab}) => {

    // manage global state
    const dispatch = useDispatch();

    // manage form state
    const { control } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: "fields",
    });

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);
        const sortedFields = arrayMove(fields, oldIndex, newIndex);
        move(oldIndex, newIndex);
        setActiveTab(newIndex);

        dispatch(setFields(sortedFields));
    };

    const handleTabChange = (index) => {
        setActiveTab(index);
    };

    return (
        <React.Fragment>
            <div className="flex-between mb-24">
                <h3>
                    {useTranslation("Manage product data fields")}
                </h3>
                <SwitchView
                    localStorageKey="wc_fields_manage_view"
                    setView={setView}
                    view={view}
                    choices={['list', 'tabular']}
                />
            </div>
            <BulkActions
                view="tab"
                setFieldTab={setActiveTab}
            />
            {fields.length > 0 ? (
                <div className="acpt-horizontal-tabs">
                    <div className="tablist">
                        <SortableList
                            onDragEnd={handleDragEnd}
                            items={fields}
                        >
                            {fields.map((field, index) => {
                                return (
                                    <ProductDataFieldSortableTab
                                        index={index}
                                        field={field}
                                        activeTab={activeTab}
                                        onClick={handleTabChange}
                                    />
                                )
                            })}
                        </SortableList>
                    </div>
                    {fields.map((field, index) => (
                        <React.Fragment>
                            {index === activeTab && (
                                <div className="tab-panel">
                                    <ProductDataField
                                        field={field}
                                        index={index}
                                        view={view}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                <Alert style={styleVariants.WARNING}>
                    {useTranslation('No fields already created. Create the first one now by clicking the button "Add field"!')}
                </Alert>
            )}
        </React.Fragment>
    );
};

TabularView.propTypes = {
    view: PropTypes.string.isRequired,
    setView: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    activeTab: PropTypes.number.isRequired,
    setActiveTab: PropTypes.func.isRequired,
};

export default TabularView;