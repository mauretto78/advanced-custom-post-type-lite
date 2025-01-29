import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../../hooks/useTranslation";
import {useFormContext, useWatch} from "react-hook-form";
import {canBeQuickEdited, getFormId, isFilterable} from "../../../../utils/fields";
import {useSelector} from "react-redux";
import {fieldTypes} from "../../../../constants/fields";
import Tooltip from "../../../../components/Tooltip";
import ButtonSwitch from "../../../../components/Forms/ButtonSwitch";

const MetaFieldSwitches = ({boxId, field}) => {

    // manage global state
    const {group} = useSelector(state => state.metaState);

    // manage form state
    const { formState: {errors}, register, control } = useFormContext();

    /**
     *
     * @param value
     * @return {string}
     */
    const formId = (value) => {
        return `${getFormId(group.boxes, boxId, field.id)}.${value}`;
    };

    const watchedType = useWatch({
        control,
        name: formId("type")
    });
    const watchedShowInArchive = useWatch({
        control,
        name: formId("showInArchive")
    });
    const watchedFilterableInAdmin = useWatch({
        control,
        name: formId("filterableInAdmin")
    });
    const watchedQuickEdit = useWatch({
        control,
        name: formId("quickEdit")
    });
    const watchedIsRequired = useWatch({
        control,
        name: formId("isRequired")
    });

    /**
     *
     * @return {*}
     */
    const fieldType = () => {
        return watchedType ? watchedType : field.type;
    };

    /**
     *
     * @return {boolean|boolean}
     */
    const isNotNestableField = () => {
        return fieldType() !== fieldTypes.CLONE && fieldType() !== fieldTypes.REPEATER && fieldType() !== fieldTypes.FLEXIBLE && fieldType() !== fieldTypes.LIST;
    };

    /**
     *
     * @return {boolean|boolean}
     */
    const isChildField = () => {
        return field.parentId || field.blockId;
    };

    return (
        <div className="i-flex-center s-4">
            <Tooltip
                label={
                    <ButtonSwitch
                        id={formId("showInArchive")}
                        control={control}
                        defaultValue={typeof watchedShowInArchive === "boolean" ? watchedShowInArchive : field.showInArchive}
                        errors={errors}
                        icon="bxl:wordpress"
                    />
                }
                tip={useTranslation("Show in Wordpress admin post lists page")}
                icon={false}
            />
            {isNotNestableField() && (
                <React.Fragment>
                    {!isChildField() && (
                        <React.Fragment>
                            {isFilterable(field.type) && (
                                <Tooltip
                                    label={
                                        <ButtonSwitch
                                            control={control}
                                            defaultValue={typeof watchedFilterableInAdmin  === "boolean" ? watchedFilterableInAdmin : field.filterableInAdmin}
                                            errors={errors}
                                            icon="bx:filter"
                                            id={formId("filterableInAdmin")}
                                        />
                                    }
                                    tip={useTranslation("Filterable in Wordpress admin post lists page")}
                                    icon={false}
                                />
                            )}
                            {canBeQuickEdited(field.type) && (
                                <Tooltip
                                    label={
                                        <ButtonSwitch
                                            control={control}
                                            defaultValue={typeof watchedQuickEdit  === "boolean" ? watchedQuickEdit : field.quickEdit}
                                            errors={errors}
                                            icon="bx:pencil"
                                            id={formId("quickEdit")}
                                        />
                                    }
                                    tip={useTranslation("Quick edit in Wordpress admin post lists page")}
                                    icon={false}
                                />
                            )}
                        </React.Fragment>
                    )}
                    <Tooltip
                        label={
                            <React.Fragment>
                                <ButtonSwitch
                                    control={control}
                                    defaultValue={typeof watchedIsRequired  === "boolean" ? watchedIsRequired : field.isRequired}
                                    errors={errors}
                                    icon="foundation:asterisk"
                                    id={formId("isRequired")}
                                />
                            </React.Fragment>
                        }
                        tip={useTranslation("Field required")}
                        icon={false}
                    />
                </React.Fragment>
            )}
        </div>
    );
};

MetaFieldSwitches.propTypes = {
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired
};

export default MetaFieldSwitches;