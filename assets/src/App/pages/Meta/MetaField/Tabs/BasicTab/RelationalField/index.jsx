import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../../../../hooks/useTranslation";
import {useFormContext, useWatch} from "react-hook-form";
import {
    isBidirectional,
    relationshipList,
    unidirectionalRelationshipList
} from "../../../../../../constants/relationships";
import Select from "../../../../../../components/Forms/Select";
import {isEmpty} from "../../../../../../utils/objects";
import {wpAjaxRequest} from "../../../../../../utils/ajax";
import InputHidden from "../../../../../../components/Forms/InputHidden";
import {metaTypes} from "../../../../../../constants/metaTypes";
import Tooltip from "../../../../../../components/Tooltip";

const RelationalField = ({field, formId}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // manage global state
    const findBelongsValues = globals.find;

    // manage local state
    const savedRelation = (field.relations && field.relations.length > 0) ? field.relations[0] : null;

    // manage form state
    const { control, register, resetField, setValue, formState: {errors} } = useFormContext();

    const watchedCondition = useWatch({
        control,
        name: formId("relations.0.relationship")
    });

    const groupId = useWatch({
        control,
        name: "id"
    });

    const [fetchedInversedBoxes, setFetchedInversedBoxes] = useState([]);
    const [inversedBoxes, setInversedBoxes] = useState([]);
    const [inversedFields, setInversedFields] = useState([]);

    /**
     * Populate inversed meta field box
     */
    useEffect(() => {
        wpAjaxRequest('fetchMetaAction', {
            excludeField: field.id
        })
            .then(r => {

                let fetchedBoxes = [];
                let groups = [
                    {
                        label: useTranslation("Select"),
                        value: null
                    }
                ];

                r.records && r.records.length > 0 && r.records.filter((group) => group.id !== groupId).map((group) => {

                    let boxes = [];

                    group.boxes.map((box) => {
                        fetchedBoxes.push(box);
                        boxes.push({
                            label: box.UIName + " ("+group.name+")",
                            value: box.id
                        });
                    });

                    if(boxes && boxes.length > 0) {
                        groups.push({
                            label: group.name,
                            options: boxes
                        });
                    }
                });

                setFetchedInversedBoxes(fetchedBoxes);
                setInversedBoxes(groups);

                if(savedRelation && savedRelation.inversedBoxId){
                    handleInversedBoxChange(savedRelation.inversedBoxId, fetchedBoxes);
                }

            })
            .catch(e => console.error(e))
        ;
    }, []);

    const handleRelationshipChange = (relationship) => {
        if(!isBidirectional(relationship)){
            resetField(formId("relations.0.inversedBoxId"));
            resetField(formId("relations.0.inversedFieldId"));
        }
    };

    const handleEntityChange = (type, value) => {
        setValue(formId(`relations.0.${type}.type`), value);
        resetField(formId("relations.0.relationship"));
        resetField(formId("relations.0.inversedBoxId"));
        resetField(formId("relations.0.inversedFieldId"));
    };

    const handleInversedBoxChange = (boxId, fetchedBoxes) => {

        let fields = [
            {
                label: useTranslation("Select"),
                value: null
            }
        ];

        const filteredBoxes = fetchedBoxes.filter(b => b.id === boxId);

        if(filteredBoxes && filteredBoxes.length === 1){
            filteredBoxes[0].fields.map((field) => {
                fields.push({
                    label: field.name,
                    value: field.id
                });

                field.blocks && field.blocks.length > 0 && field.blocks.map((b) => {
                    b.fields && b.fields.length > 0 && b.fields.map((f) => {
                        fields.push({
                            label: f.name,
                            value: f.id
                        });

                        f.blocks && f.blocks.length > 0 && f.blocks.map((bb) => {
                            bb.fields && bb.fields.length > 0 && bb.fields.map((ff) => {
                                fields.push({
                                    label: ff.name,
                                    value: ff.id
                                });
                            });
                        });
                    });
                });

                field.children && field.children.length > 0 && field.children.map((f) => {
                    fields.push({
                        label: f.name,
                        value: f.id
                    });

                    f.children && f.children.length > 0 && f.children.map((ff) => {
                        fields.push({
                            label: ff.name,
                            value: ff.id
                        });
                    });
                });
            });
        }

        setInversedFields(fields);
    };

    if(isEmpty(findBelongsValues)){
        return null;
    }

    /**
     *
     * @return {[{label: *, value: null}, {options: *, label: *}, {options: *, label: *}, {options: *, label: *}, {options: [{label: *, value: string}], label: *}]}
     */
    const locationList = () => {

        let list = [{
            label: useTranslation("Select"),
            value: null
        }];

        const postTypes = findBelongsValues[metaTypes.CUSTOM_POST_TYPE].filter((v) => v.value !== null);
        const taxonomies = findBelongsValues[metaTypes.TAXONOMY].filter((v) => v.value !== null);

        if(postTypes && postTypes.length > 0){
            list.push({
                label: useTranslation("Custom post types"),
                originalLabel: metaTypes.CUSTOM_POST_TYPE,
                options: postTypes
            });
        }

        if(taxonomies && taxonomies.length > 0){
            list.push({
                label: useTranslation("Taxonomies"),
                originalLabel: metaTypes.TAXONOMY,
                options: taxonomies
            });
        }

        list.push({
            label: useTranslation("Option pages"),
            originalLabel: metaTypes.OPTION_PAGE,
            options: [
                { label: useTranslation("All pages"), value: metaTypes.OPTION_PAGE }
            ]
        });

        list.push({
            label: useTranslation("Users"),
            originalLabel: metaTypes.USER,
            options: [
                { label: useTranslation("All users"), value: metaTypes.USER }
            ]
        });

        return list;
    };

    return (
        <div className="mt-24">
            <InputHidden
                id={formId("relations.0.relatedEntity.type")}
                value={field.type}
                register={register}
            />
            <fieldset className="acpt-fieldset">
                <legend>
                    {useTranslation("Related entities and relationship")}
                </legend>
                <div className="flex-column s-24">
                    <div className="container align-end">
                        <div className="col-4">
                            <div className="mb-8">
                                <Tooltip
                                    label={
                                        <label className="form-label" htmlFor={formId("relations.0.from.value")}>
                                            {useTranslation("From")}
                                        </label>
                                    }
                                    tip={useTranslation("The first entity involved in the relationship")}
                                />
                            </div>
                            <Select
                                register={register}
                                id={formId("relations.0.from.value")}
                                errors={errors}
                                values={locationList()}
                                onChangeCapture={e => {
                                    handleEntityChange("from", e.target.selectedOptions[0].parentElement.dataset.original);
                                }}
                                validate={{
                                    required: useTranslation("This field is mandatory"),
                                }}
                            />
                        </div>
                        <div className="col-4">
                            <div className="mb-8">
                                <Tooltip
                                    label={
                                        <label className="form-label" htmlFor={formId("relations.0.to.value")}>
                                            {useTranslation("To")}
                                        </label>
                                    }
                                    tip={useTranslation("The second entity involved in the relationship")}
                                />
                            </div>
                            <Select
                                register={register}
                                id={formId("relations.0.to.value")}
                                errors={errors}
                                values={locationList()}
                                onChangeCapture={e => {
                                    handleEntityChange("to", e.target.selectedOptions[0].parentElement.dataset.original);
                                }}
                                validate={{
                                    required: useTranslation("This field is mandatory"),
                                }}
                            />
                        </div>
                        <div className="col-4">
                            <div className="mb-8">
                                <Tooltip
                                    label={
                                        <label className="form-label" htmlFor={formId("relations.0.relationship")}>
                                            {useTranslation("Relationship")}
                                        </label>
                                    }
                                    tip={useTranslation("The relationship between the selected entities")}
                                />
                            </div>
                            <Select
                                register={register}
                                id={formId("relations.0.relationship")}
                                errors={errors}
                                values={field.parentId ? unidirectionalRelationshipList : relationshipList}
                                onChangeCapture={e => {
                                    handleRelationshipChange(e.target.value);
                                }}
                                validate={{
                                    required: useTranslation("This field is mandatory"),
                                }}
                            />
                        </div>
                    </div>
                    {isBidirectional(watchedCondition) && (
                        <div className="container align-end">
                            <div className="col-6">
                                <div className="mb-8">
                                    <Tooltip
                                        label={
                                            <label className="form-label" htmlFor={formId("relations.0.inversedBoxId")}>
                                                {useTranslation("Target field")}. {useTranslation("Select field box from list")}
                                            </label>
                                        }
                                        tip={useTranslation("The inversed field is the target post type field which is related with this one in a bidirectional relation")}
                                    />
                                </div>
                                <Select
                                    register={register}
                                    id={formId("relations.0.inversedBoxId")}
                                    errors={errors}
                                    values={inversedBoxes}
                                    defaultValue={(savedRelation && savedRelation.inversedBoxId) ? savedRelation.inversedBoxId : null}
                                    onChangeCapture={e => {
                                        handleInversedBoxChange(e.target.value, fetchedInversedBoxes);
                                    }}
                                    validate={{
                                        required: useTranslation("This field is mandatory"),
                                    }}
                                />
                            </div>
                            <div className="col-6">
                                <div className="mb-8">
                                    <Tooltip
                                        label={
                                            <label className="form-label" htmlFor={formId("relations.0.inversedFieldId")}>
                                                {useTranslation("Target field")}. {useTranslation("Select the inversed field on target")}
                                            </label>
                                        }
                                        tip={useTranslation("The inversed field is the target post type field which is related with this one in a bidirectional relation")}
                                    />
                                </div>
                                <Select
                                    register={register}
                                    id={formId("relations.0.inversedFieldId")}
                                    errors={errors}
                                    values={inversedFields}
                                    defaultValue={(savedRelation && savedRelation.inversedFieldId) ? savedRelation.inversedFieldId : null}
                                    validate={{
                                        required: useTranslation("This field is mandatory"),
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </fieldset>
        </div>
    );
};

RelationalField.propTypes = {
    formId: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
};

export default RelationalField;