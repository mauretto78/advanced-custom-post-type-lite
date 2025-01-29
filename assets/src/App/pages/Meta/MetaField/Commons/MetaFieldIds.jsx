import React from "react";
import PropTypes from 'prop-types';
import InputHidden from "../../../../components/Forms/InputHidden";
import {metaFieldFormId} from "../../../../utils/fields";
import {useSelector} from "react-redux";
import {useFormContext} from "react-hook-form";

const MetaFieldIds = ({boxId, field, parentFieldId, parentBlockId}) => {

    // manage global state
    const {group} = useSelector(state => state.metaState);

    // manage form state
    const { formState: {errors}, register } = useFormContext();

    /**
     *
     * @param value
     * @return {string}
     */
    const formId = (value) => {
        return metaFieldFormId(group.boxes, boxId, field.id,value);
    };

    return (
        <React.Fragment>
            <InputHidden
                id={formId("id")}
                value={field.id}
                register={register}
            />
            <InputHidden
                id={formId("parentId")}
                value={parentFieldId ? parentFieldId : ''}
                register={register}
            />
            <InputHidden
                id={formId("blockId")}
                value={parentBlockId ? parentBlockId : ''}
                register={register}
            />
        </React.Fragment>
    );
};

MetaFieldIds.propTypes = {
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string
};

export default MetaFieldIds;