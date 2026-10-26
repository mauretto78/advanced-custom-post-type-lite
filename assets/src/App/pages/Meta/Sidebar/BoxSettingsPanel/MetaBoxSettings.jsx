import React from "react";
import PropTypes from "prop-types";
import {useFormContext, useWatch} from "react-hook-form";
import Label from "../../../../components/Forms/Label.jsx";
import useTranslation from "../../../../hooks/useTranslation.jsx";
import Select from "../../../../components/Forms/Select.jsx";
import {contextOptions, priorityOptions} from "../../../../constants/fields.jsx";
import {isEmpty} from "../../../../utils/objects.jsx";
import Toggle from "../../../../components/Forms/Toggle.jsx";
import ConditionalRendering from "./ConditionalRendering.jsx";
import {metaBoxProps} from "../../../../props/metaProps.js";

const MetaBoxSettings = ({index, box}) => {

    // manage form state
    const formId = (value) => {
        return `boxes.${index}.settings[0].${value}`;
    };

    const { register, formState: {errors}, control } = useFormContext();

    const watchedContext = useWatch({
        control,
        name: "context"
    });

    const watchedPriority = useWatch({
        control,
        name: "priority"
    });

    return (
        <React.Fragment>
            <div>
                <Label
                    size="xs"
                    id={formId("context")}
                    label={useTranslation("Context")}
                />
                <Select
                    size="xs"
                    id={formId("context")}
                    register={register}
                    errors={errors}
                    values={contextOptions}
                    defaultValue={!isEmpty(box) && box.settings?.context ? box.settings.context : watchedContext ? watchedContext : 'advanced'}
                />
            </div>
            <div>
                <Label
                    size="xs"
                    id={formId("priority")}
                    label={useTranslation("Priority")}
                />
                <Select
                    size="xs"
                    id={formId("priority")}
                    register={register}
                    errors={errors}
                    values={priorityOptions}
                    defaultValue={!isEmpty(box) && box.settings?.priority ? box.settings.priority : watchedPriority ? watchedPriority : 'default'}
                />
            </div>
            <div className="i-flex-center s-8">
                <Toggle
                    id={formId("hide_title")}
                    register={register}
                    errors={errors}
                    defaultValue={!isEmpty(box) && box.settings?.hide_title ? box.settings.hide_title : false}
                />
                <Label
                    size="xs"
                    className="m-0"
                    id={formId("hide_title")}
                    label={useTranslation("Hide title")}
                />
            </div>
            <div className="i-flex-center s-8">
                <Toggle
                    id={formId("hide_toggle")}
                    register={register}
                    errors={errors}
                    defaultValue={!isEmpty(box) && box.settings?.hide_toggle ? box.settings.hide_toggle : false}
                />
                <Label
                    size="xs"
                    className="m-0"
                    id={formId("hide_toggle")}
                    label={useTranslation("Hide toggle visibility")}
                />
            </div>
            <ConditionalRendering
                box={box}
                boxIndex={index}
            />
        </React.Fragment>
    );
};

MetaBoxSettings.propTypes = {
    index: PropTypes.number.isRequired,
    box: PropTypes.shape(metaBoxProps).isRequired,
};

export default MetaBoxSettings;