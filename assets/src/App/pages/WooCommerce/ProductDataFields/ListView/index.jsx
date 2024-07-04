import React from 'react';
import PropTypes from "prop-types";
import useTranslation from "../../../../hooks/useTranslation";
import SwitchView from "../../../../components/SwitchView";
import Alert from "../../../../components/Alert";
import {styleVariants} from "../../../../constants/styles";
import SortableList from "../../../../components/SortableList";
import ProductDataField from "../ProductDataField";
import {useDispatch} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import {arrayMove} from "@dnd-kit/sortable";
import {setFields} from "../../../../redux/reducers/productDataFieldsStateSlice";
import QuickNavigation from "./QuickNavigation";
import BulkActions from "../../BulkActions";

const ListView = ({fields, view, setView, setActiveTab}) => {

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

        dispatch(setFields(sortedFields));
    };

    return (
        <div className="container">
            <div className="col-3 flex-column s-24 hidden-xs sticky" style={{
                top: "130px"
            }}>
                <QuickNavigation fields={fields}/>
            </div>
            <div className="col-9">
                <div className="flex-between mb-24 s-8 for-xs">
                    <h3>
                        {useTranslation("Manage product data fields")}
                    </h3>
                    <div className="i-flex-center s-8">
                        <SwitchView
                            localStorageKey="wc_fields_manage_view"
                            setView={setView}
                            view={view}
                            choices={['list', 'tabular']}
                        />
                    </div>
                </div>
                <BulkActions
                    view="list"
                />
                {fields.length > 0 ? (
                    <SortableList
                        onDragEnd={handleDragEnd}
                        items={fields}
                    >
                        <div className="flex-column s-24">
                            {fields.map((field, index)=> (
                                <ProductDataField
                                    index={index}
                                    key={field.id}
                                    view="list"
                                    field={field}
                                />
                            ))}
                        </div>
                    </SortableList>
                ) : (
                    <Alert style={styleVariants.WARNING}>
                        {useTranslation('No fields already created. Create the first one now by clicking the button "Add field"!')}
                    </Alert>
                )}
            </div>
        </div>
    );
};

ListView.propTypes = {
    view: PropTypes.string.isRequired,
    setView: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    setActiveTab: PropTypes.func.isRequired,
};

export default ListView;