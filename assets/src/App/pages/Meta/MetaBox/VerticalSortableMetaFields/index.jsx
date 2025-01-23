import React from "react";
import PropTypes from 'prop-types';
import {arrayMove} from "@dnd-kit/sortable";
import useTranslation from "../../../../hooks/useTranslation";
import {styleVariants} from "../../../../constants/styles";
import {useDispatch, useSelector} from "react-redux";
import {addField, selectElement, setFields} from "../../../../redux/reducers/metaStateSlice";
import MetaField from "../../MetaField";
import {v4 as uuidv4} from "uuid";
import {fieldTypes} from '../../../../constants/fields';
import SortableList from "../../../../components/SortableList";
import {useFieldArray, useFormContext} from "react-hook-form";
import {formatFieldForSelection, getFormId} from "../../../../utils/fields";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import Button from "../../../../components/Button";
import {randomAlphabeticString} from "../../../../utils/strings";

const VerticalSortableMetaFields = ({boxIndex, boxId, parentFieldIndex, parentFieldId, parentBlockId, fields, addFieldEnabled = true}) => {

    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;
    const globals = documentGlobals.globals;

    // manage global state
    const dispatch = useDispatch();
    const {group, selectedElementsType} = useSelector(state => state.metaState);

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

    const selectAllSelector = `select-fields-${randomAlphabeticString()}`;

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

    /**
     * Handle select/deselect all fields
     */
    const handleSelectAllFields = (checked) => {
        fields && fields.map((f) => {

            const element = formatFieldForSelection(f, boxId, parentFieldId, parentBlockId);

            dispatch(selectElement({
                    element: element,
                    selected: checked,
                    type: 'field'
                }
            ));

            element.children && element.children.map((subElement) => {

                dispatch(selectElement({
                    element: subElement,
                    selected: checked,
                    type: 'field'
                }));

                subElement.children && subElement.children.map((subSubElement) => {

                    dispatch(selectElement({
                        element: subSubElement,
                        selected: checked,
                        type: 'field'
                    }));
                });
            });
        });
    };

    return (
        <React.Fragment>
            {fields && fields.length > 0 ? (
                <div className={`responsive ${parentFieldId ? "with-shadow b-rounded" : "" }`}>
                    <table className={`acpt-table  ${globals.is_rtl ? 'rtl' : ''}`}>
                        <thead>
                            <tr>
                                <th style={{width: "10px"}}>
                                    {selectedElementsType !== 'box' && selectedElementsType !== 'block' && (
                                        <label className="checkbox" htmlFor={selectAllSelector} style={{marginLeft: "26px"}}>
                                            <input
                                                id={selectAllSelector}
                                                type="checkbox"
                                                onChange={e => {
                                                    handleSelectAllFields(e.target.checked);
                                                }}
                                            />
                                            <span/>
                                        </label>
                                    )}
                                </th>
                                <th className="hidden-xs">
                                    {useTranslation("Label")}
                                </th>
                                <th>
                                    {useTranslation("Slug")}
                                </th>
                                <th className="hidden-xs" style={{width: "10px"}}/>
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
                                    <MetaField
                                        isMainView={false}
                                        boxIndex={boxIndex}
                                        fieldIndex={fieldIndex}
                                        boxId={boxId}
                                        field={field}
                                        parentFieldIndex={parentFieldIndex}
                                        parentFieldId={parentFieldId}
                                        parentBlockId={parentBlockId}
                                    />
                                ))}
                            </SortableList>
                        </tbody>
                    </table>
                    {addFieldEnabled && (
                        <div className="p-24">
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
                    )}
                </div>
            ) : (
                <div
                    className={`${parentFieldId ? "" : "mx-24 pb-24" }`}
                >
                    <div className="b-maxi b-rounded p-24 flex-column s-12 text-center">
                        <span>
                            {useTranslation('No field box already created. Create the first one now by clicking the button "Add field box"!')}
                        </span>
                        {addFieldEnabled && (
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
                        )}
                    </div>
                </div>
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
    addFieldEnabled: PropTypes.bool
};

export default VerticalSortableMetaFields;