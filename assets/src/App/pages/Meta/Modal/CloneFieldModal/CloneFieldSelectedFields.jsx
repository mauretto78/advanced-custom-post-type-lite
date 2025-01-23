import React from "react";
import PropTypes from 'prop-types';
import CloneFieldSelectedField from "./CloneFieldSelectedField";
import {useFormContext} from "react-hook-form";

const CloneFieldSelectedFields = ({fields, meta, id}) => {

    const { setValue } = useFormContext();

    const handleDeleteField = (fieldId) => {
        const newValues = fields.filter(f => f !== fieldId);
        setValue(id, newValues);
    };

    if(!fields){
        return null;
    }

    if(fields.length === 0){
        return null;
    }

    return (
        <div className="flex flex-wrap justify-center s-8">
            {fields && fields.length > 0 && fields.map((id) => (
                <CloneFieldSelectedField
                    meta={meta}
                    clonedFieldId={id}
                    handleDeleteField={handleDeleteField}
                />
            ))}
        </div>
    );
};

CloneFieldSelectedFields.propTypes = {
    id: PropTypes.string.isRequired,
    meta: PropTypes.array.isRequired,
    fields: PropTypes.array.isRequired
};

export default CloneFieldSelectedFields;