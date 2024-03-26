import React from "react";
import PropTypes from 'prop-types';
import {arrayMove} from "@dnd-kit/sortable";
import Alert from "../../../../components/Alert";
import useTranslation from "../../../../hooks/useTranslation";
import {styleVariants} from "../../../../constants/styles";
import {useDispatch, useSelector} from "react-redux";
import {addField, setFields} from "../../../../redux/reducers/metaStateSlice";
import MetaField from "../../MetaField";
import {v4 as uuidv4} from "uuid";
import {fieldTypes} from '../../../../constants/fields';
import SortableList from "../../../../components/SortableList";
import {useFieldArray, useFormContext} from "react-hook-form";
import {getFormId} from "../../../../utils/fields";
import {useAutoAnimate} from "@formkit/auto-animate/react";

const VerticalSortableMetaFields = ({boxIndex, boxId, parentFieldIndex, parentFieldId, parentBlockId, fields, addFieldEnabled = true}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    // auto-animate
    const [parent] = useAutoAnimate();

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

        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);
        const sortedFields = arrayMove(fields, oldIndex, newIndex);
        move(oldIndex, newIndex);

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
            isSaved: false
        };

        dispatch(addField({boxId, parentFieldId, parentBlockId, field}));
    };

    return (
        <React.Fragment>
            <div
                className={fields.length > 0 ? "bg-pale-gray b-rounded p-24 flex-column s-24" : ""}
                ref={parent}
            >
                {fields.length > 0 ? (
                    <SortableList
                        onDragEnd={handleDragEnd}
                        items={fields}
                    >
                        {fields.map((field, fieldIndex) => (
                            <MetaField
                                boxIndex={boxIndex}
                                fieldIndex={fieldIndex}
                                boxId={boxId}
                                field={field}
                                parentFieldIndex={parentFieldIndex}
                                parentFieldId={parentFieldId}
                                parentBlockId={parentBlockId}
                                view="list"
                            />
                        ))}
                    </SortableList>
                ) : (
                    <Alert style={styleVariants.WARNING}>
                        {useTranslation('No field box already created. Create the first one now by clicking the button "Add field box"!')}
                    </Alert>
                )}
            </div>



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
    );
};

VerticalSortableMetaFields.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string,
    addFieldEnabled: PropTypes.bool,
};

export default VerticalSortableMetaFields;