import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import HorizontalSortableMetaFieldTab from "./HorizontalSortableMetaFieldTab";
import SortableList from "../../../../components/SortableList";
import {useDispatch, useSelector} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import MetaField from "../../MetaField";
import {styleVariants} from "../../../../constants/styles";
import useTranslation from "../../../../hooks/useTranslation";
import Alert from "../../../../components/Alert";
import {v4 as uuidv4} from "uuid";
import {fieldTypes} from "../../../../constants/fields";
import {addField, setFields} from "../../../../redux/reducers/metaStateSlice";
import Button from "../../../../components/Button";
import {arrayMove} from "@dnd-kit/sortable";
import {getFormId} from "../../../../utils/fields";

const HorizontalSortableMetaFields = ({boxIndex, boxId, fields, parentFieldIndex, parentFieldId, parentBlockId, addFieldEnabled = true}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    const formId = () => {

        if(parentBlockId){
            return `${getFormId(group.boxes, boxId, parentBlockId)}.fields`;
        }

        if(parentFieldId){
            return `${getFormId(group.boxes, boxId, parentFieldId)}.children`;
        }

        return `boxes.${boxIndex}.fields`;
    };

    // manage form state
    const { control, getValues } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: formId(),
    });

    // manage local state
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if(!fields[activeTab]){
            setActiveTab(0);
        }
    },[fields]);

    const handleOnClick = (index) => {
        setActiveTab(index);
    };

    const onDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);
        const sortedFields = arrayMove(fields, oldIndex, newIndex);
        move(oldIndex, newIndex);

        setActiveTab(newIndex);
        dispatch(setFields({boxId, parentFieldId, parentBlockId, sortedFields}));
    };

    const handleAddField = () => {

        const field = {
            id: uuidv4(),
            boxId: boxId,
            name: 'meta_box_field',
            label: 'meta box field',
            type: fieldTypes.TEXT,
            defaultValue: "",
            description: "",
            isRequired: false,
            showInArchive: false,
            quickEdit: false,
            filterableInAdmin: false,
            sort: 1,
            advancedOptions: [],
            options: [],
            blocks: [],
            blockId: parentBlockId ? parentBlockId : null,
            validationRules: [],
            visibilityConditions: [],
            hasManyRelation: [],
            children: [],
            parentId: parentFieldId ? parentFieldId : null,
            isATextualField: true,
            isFilterable: true,
            isSaved: false,
        };

        dispatch(addField({boxId, parentFieldId, parentBlockId, field}));
        setActiveTab(fields ? fields.length : 0);
    };

    return (
        <React.Fragment>
            {fields && fields.length > 0 ? (
                <React.Fragment>
                    <div className="flex-wrap i-flex-center s-8 mb-12">
                        <SortableList
                            items={fields}
                            onDragEnd={onDragEnd}
                            mode="horizontal"
                        >
                            {fields && fields.map((field, fieldIndex) => (
                                <HorizontalSortableMetaFieldTab
                                    isActive={activeTab === fieldIndex}
                                    onClick={handleOnClick}
                                    boxIndex={boxIndex}
                                    boxId={boxId}
                                    fieldIndex={fieldIndex}
                                    field={field}
                                    parentFieldIndex={parentFieldIndex}
                                    parentFieldId={parentFieldId}
                                    parentBlockId={parentBlockId}
                                    key={field.id}
                                />
                            ))}
                        </SortableList>
                        <Button
                            type="button"
                            style={styleVariants.SECONDARY}
                            size="sm"
                            onClick={e => {
                                e.preventDefault();
                                handleAddField();
                            }}
                        >
                            +
                        </Button>
                    </div>
                    <div>
                        {fields && fields.map((field, fieldIndex) => (
                            <React.Fragment>
                                {fieldIndex === activeTab && (
                                    <div className="with-border b-rounded">
                                        <MetaField
                                            setActiveTab={setActiveTab}
                                            fieldIndex={fieldIndex}
                                            field={field}
                                            view="tabular"
                                            boxIndex={boxIndex}
                                            boxId={boxId}
                                            parentFieldIndex={parentFieldIndex}
                                            parentFieldId={parentFieldId}
                                            parentBlockId={parentBlockId}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Alert style={styleVariants.WARNING}>
                        {useTranslation('No field box already created. Create the first one now by clicking the button "Add field box"!')}
                    </Alert>
                    {addFieldEnabled && (
                        <a
                            className="acpt-btn acpt-btn-secondary acpt-btn-sm mt-24"
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                handleAddField();
                            }}
                        >
                            {useTranslation("Add field box")}
                        </a>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

HorizontalSortableMetaFields.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string,
    addFieldEnabled: PropTypes.bool,
};

export default HorizontalSortableMetaFields;

