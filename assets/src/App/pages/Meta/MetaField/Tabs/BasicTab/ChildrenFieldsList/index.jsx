import React from "react";
import PropTypes from 'prop-types';
import VerticalSortableMetaFields from "../../../../MetaBox/VerticalSortableMetaFields";
import {fieldSettings} from "../../../../../../constants/fields";
import useTranslation from "../../../../../../hooks/useTranslation";

const ChildrenFieldsList = ({boxId, boxIndex, parentFieldIndex, parentFieldId, childrenFields, nestingLevel}) => {

    const addFieldEnabled = nestingLevel < fieldSettings.MAX_NESTING;

    return (
        <div className="mt-24">
            <label className="form-label">
                {useTranslation("Children")}
            </label>
            <VerticalSortableMetaFields
                addFieldEnabled={addFieldEnabled}
                boxIndex={boxIndex}
                boxId={boxId}
                parentFieldIndex={parentFieldIndex}
                parentFieldId={parentFieldId}
                fields={childrenFields}
            />
        </div>
    );
};

ChildrenFieldsList.propTypes = {
    boxId: PropTypes.string.isRequired,
    parentFieldId: PropTypes.string.isRequired,
    boxIndex: PropTypes.number.isRequired,
    parentFieldIndex: PropTypes.number.isRequired,
    childrenFields: PropTypes.array.isRequired,
    nestingLevel: PropTypes.number.isRequired,
};

export default ChildrenFieldsList;

