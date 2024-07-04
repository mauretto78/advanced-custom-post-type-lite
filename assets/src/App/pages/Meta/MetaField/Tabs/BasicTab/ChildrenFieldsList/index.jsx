import React from "react";
import PropTypes from 'prop-types';
import VerticalSortableMetaFields from "../../../../MetaBox/VerticalSortableMetaFields";
import HorizontalSortableMetaFields from "../../../../MetaBox/HorizontalSortableMetaFields";
import {fieldSettings} from "../../../../../../constants/fields";

const ChildrenFieldsList = ({view, boxId, boxIndex, parentFieldIndex, parentFieldId, childrenFields, nestingLevel}) => {

    const addFieldEnabled = nestingLevel < fieldSettings.MAX_NESTING;

    return (
        <div className={`mt-24 ${view === 'accordion' ? 'with-border b-rounded' : ''}`}>
            {(view === 'list' || view === 'accordion') ? (
                <VerticalSortableMetaFields
                    addFieldEnabled={addFieldEnabled}
                    boxIndex={boxIndex}
                    boxId={boxId}
                    parentFieldIndex={parentFieldIndex}
                    parentFieldId={parentFieldId}
                    fields={childrenFields}
                    view={view}
                />
            ) : (
                <HorizontalSortableMetaFields
                    addFieldEnabled={addFieldEnabled}
                    boxIndex={boxIndex}
                    boxId={boxId}
                    parentFieldIndex={parentFieldIndex}
                    parentFieldId={parentFieldId}
                    fields={childrenFields}
                />
            )}
        </div>
    );
};

ChildrenFieldsList.propTypes = {
    view: PropTypes.oneOf([
        "list",
        "accordion",
        "tabular"
    ]).isRequired,
    boxId: PropTypes.string.isRequired,
    parentFieldId: PropTypes.string.isRequired,
    boxIndex: PropTypes.number.isRequired,
    parentFieldIndex: PropTypes.number.isRequired,
    childrenFields: PropTypes.array.isRequired,
    nestingLevel: PropTypes.number.isRequired,
};

export default ChildrenFieldsList;

