import React from "react";
import PropTypes from 'prop-types';
import QuickNavigationField from "./QuickNavigationField";
import useTranslation from "../../../../hooks/useTranslation";
import SortableList from "../../../../components/SortableList";
import {useDispatch} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import {arrayMove} from "@dnd-kit/sortable";
import {setFields} from "../../../../redux/reducers/productDataFieldsStateSlice";

const QuickNavigation = ({fields}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    if(fields.length === 0){
        return null;
    }

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
        <div className="b-rounded with-shadow bg-white p-24">
            <h3 className="mb-24 flex-between s-8">
                <span className="text-ellipsis cursor-pointer">
                    {useTranslation("product data fields")}
                </span>
            </h3>
            <div className={`tree ${globals.is_rtl === true ? `rtl` : ``}`}>
                <SortableList
                    onDragEnd={handleDragEnd}
                    items={fields}
                >
                    <React.Fragment>
                        {fields.length > 0 && fields.map((field, index) => (
                            <QuickNavigationField
                                index={index}
                                field={field}
                            />
                        ))}
                    </React.Fragment>
                </SortableList>
            </div>
        </div>
    );
};

QuickNavigation.propTypes = {
    fields: PropTypes.array.isRequired,
};

export default QuickNavigation;