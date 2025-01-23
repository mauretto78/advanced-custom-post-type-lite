import React from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Card from "../../../components/Card";
import CardRow from "../../../components/Card/CardRow";
import {useFormContext} from "react-hook-form";
import Toggle from "../../../components/Forms/Toggle";

const ContentSettingsTab = ({enable_cpt, enable_tax, enable_op, enable_meta, enable_forms}) => {

    const { register, formState: {errors} } = useFormContext();

    return (
        <Card>
            <CardRow
                label={useTranslation("Enable custom post types")}
                value={
                    <Toggle
                        id="enable_cpt"
                        description={useTranslation("Enable the custom post types manager.")}
                        register={register}
                        errors={errors}
                        defaultValue={enable_cpt}
                    />
                }
            />
            <CardRow
                label={useTranslation("Enable taxonomies")}
                value={
                    <Toggle
                        id="enable_tax"
                        description={useTranslation("Enable the taxonomies manager.")}
                        register={register}
                        errors={errors}
                        defaultValue={enable_tax}
                    />
                }
            />
            <CardRow
                label={useTranslation("Enable Option Pages")}
                value={
                    <Toggle
                        id="enable_op"
                        description={useTranslation("Enable the Option Pages manager.")}
                        register={register}
                        errors={errors}
                        defaultValue={enable_op}
                    />
                }
            />
            <CardRow
                label={useTranslation("Enable meta fields")}
                value={
                    <Toggle
                        id="enable_meta"
                        description={useTranslation("Enable the meta fields manager.")}
                        register={register}
                        errors={errors}
                        defaultValue={enable_meta}
                    />
                }
            />
            <CardRow
                label={useTranslation("Enable forms")}
                value={
                    <Toggle
                        id="enable_forms"
                        description={useTranslation("Enable the form builder.")}
                        register={register}
                        errors={errors}
                        defaultValue={enable_forms}
                    />
                }
            />
        </Card>
    );
};

ContentSettingsTab.propTypes = {
    enable_cpt: PropTypes.bool,
    enable_tax: PropTypes.bool,
    enable_op: PropTypes.bool,
    enable_meta: PropTypes.bool,
    enable_forms: PropTypes.bool
};

export default ContentSettingsTab;