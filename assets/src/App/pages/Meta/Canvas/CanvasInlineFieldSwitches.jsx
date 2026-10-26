import React from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation.jsx";
import {useFormContext, useWatch} from "react-hook-form";
import Tooltip from "../../../components/Tooltip/index.jsx";
import ButtonSwitch from "../../../components/Forms/ButtonSwitch.jsx";
import {canBeQuickEdited, isFilterable} from "../../../utils/fields.jsx";

const CanvasInlineFieldSwitches = ({formId, showInArchive, filterableInAdmin, quickEdit, isRequired, isChildField, fieldType}) => {

    const {control, setValue, formState: {errors}} = useFormContext();

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

    const currentShowInArchive = typeof watchedShowInArchive === "boolean" ? watchedShowInArchive : showInArchive;

    return (
        <div className="i-flex-center s-4" role="presentation" onClick={e => e.stopPropagation()}>
            <Tooltip
                label={
                    <ButtonSwitch
                        size="xs"
                        id={formId("showInArchive")}
                        ariaLabel={useTranslation("Show in Wordpress admin post lists page")}
                        control={control}
                        defaultValue={currentShowInArchive}
                        errors={errors}
                        icon="bxl:wordpress"
                        externalOnChange={(el) => {
                            if (el.checked === false) {
                                setValue(formId("filterableInAdmin"), false);
                                setValue(formId("quickEdit"), false);
                            }
                        }}
                    />
                }
                tip={useTranslation("Show in Wordpress admin post lists page")}
                icon={false}
            />
            {!isChildField && isFilterable(fieldType) && (
                <Tooltip
                    label={
                        <ButtonSwitch
                            size="xs"
                            id={formId("filterableInAdmin")}
                            ariaLabel={useTranslation("Filterable in Wordpress admin post lists page")}
                            control={control}
                            defaultValue={typeof watchedFilterableInAdmin === "boolean" ? watchedFilterableInAdmin : filterableInAdmin}
                            errors={errors}
                            icon="bx:filter"
                            disabled={currentShowInArchive === false}
                        />
                    }
                    tip={`${useTranslation("Filterable in Wordpress admin post lists page")}. ${useTranslation("Available only if `show in archive` is enabled")}`}
                    icon={false}
                />
            )}
            {!isChildField && canBeQuickEdited(fieldType) && (
                <Tooltip
                    label={
                        <ButtonSwitch
                            size="xs"
                            id={formId("quickEdit")}
                            ariaLabel={useTranslation("Quick edit in Wordpress admin post lists page")}
                            control={control}
                            defaultValue={typeof watchedQuickEdit === "boolean" ? watchedQuickEdit : quickEdit}
                            errors={errors}
                            icon="bx:pencil"
                            disabled={currentShowInArchive === false}
                        />
                    }
                    tip={`${useTranslation("Quick edit in Wordpress admin post lists page")}. ${useTranslation("Available only if `show in archive` is enabled")}`}
                    icon={false}
                />
            )}
            <Tooltip
                label={
                    <ButtonSwitch
                        size="xs"
                        id={formId("isRequired")}
                        ariaLabel={useTranslation("Field required")}
                        control={control}
                        defaultValue={typeof watchedIsRequired === "boolean" ? watchedIsRequired : isRequired}
                        errors={errors}
                        icon="foundation:asterisk"
                    />
                }
                tip={useTranslation("Field required")}
                icon={false}
            />
        </div>
    );
}

CanvasInlineFieldSwitches.propTypes = {
    formId: PropTypes.func.isRequired,
    showInArchive: PropTypes.bool.isRequired,
    filterableInAdmin: PropTypes.bool.isRequired,
    quickEdit: PropTypes.bool.isRequired,
    isRequired: PropTypes.bool.isRequired,
    isChildField: PropTypes.bool.isRequired,
    // a newly-added field can briefly have no type selected yet -- isFilterable()/
    // canBeQuickEdited() already tolerate undefined.
    fieldType: PropTypes.string,
};

export default CanvasInlineFieldSwitches;
