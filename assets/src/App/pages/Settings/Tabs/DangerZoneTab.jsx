import React from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Card from "../../../components/Card";
import CardRow from "../../../components/Card/CardRow";
import {useFormContext} from "react-hook-form";
import Toggle from "../../../components/Forms/Toggle";

const DangerZoneTab = ({delete_tables_when_deactivate, delete_posts, delete_metadata}) => {

    const { register, formState: {errors} } = useFormContext();

    return (
        <Card>
            <CardRow
                label={useTranslation("Delete ACPT definitions when deactivate the plug-in")}
                value={
                    <Toggle
                        id="delete_tables_when_deactivate"
                        description={useTranslation("Delete all saved ACPT definitions when you deactivate the plug-in. This means that if you select NO when you deactivate and then reactivate the plug-in you will find all the previously saved ACPT definitions (meta fields, options etc.)")}
                        register={register}
                        errors={errors}
                        defaultValue={delete_tables_when_deactivate}
                    />
                }
            />
            <CardRow
                label={useTranslation("Delete posts when delete an ACPT post definition")}
                value={
                    <Toggle
                        id="delete_posts"
                        description={useTranslation("   Delete posts when delete an ACPT post type definition. This means that if you select YES, when you delete an ACPT post type definition all the saved posts will be deleted")}
                        register={register}
                        errors={errors}
                        defaultValue={delete_posts}
                    />
                }
            />
            <CardRow
                label={useTranslation("Delete metadata when delete an ACPT field")}
                value={
                    <Toggle
                        id="delete_metadata"
                        description={useTranslation("Delete post metadata when deleting an ACPT field. This means that if you select YES, when you delete an ACPT meta field all the saved metadata will be deleted")}
                        register={register}
                        errors={errors}
                        defaultValue={delete_metadata}
                    />
                }
            />
        </Card>
    );
};

DangerZoneTab.propTypes = {
    delete_tables_when_deactivate: PropTypes.bool,
    delete_posts: PropTypes.bool,
    delete_metadata: PropTypes.bool
};

export default DangerZoneTab;