import React from "react";
import PropTypes from 'prop-types';
import MetaFieldClosed from "./MetaFieldClosed";
import MetaFieldOpen from "./MetaFieldOpen";
import {useSelector} from "react-redux";

const MetaField = ({boxIndex, fieldIndex, boxId, field, parentFieldIndex, parentFieldId, parentBlockId, isMainView}) => {

    // manage global state
    const {closedElements} = useSelector(state => state.metaState);

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {

        const filter = closedElements.filter(e => e === field.id);

        if(typeof filter === 'undefined'){
            return false;
        }

        return filter.length > 0;
    };

    if(!isClosed()){
        return (
            <MetaFieldOpen
                boxIndex={boxIndex}
                field={field}
                boxId={boxId}
                fieldIndex={fieldIndex}
                parentFieldIndex={parentFieldIndex}
                parentFieldId={parentFieldId}
                parentBlockId={parentBlockId}
            />
        );
    }

    return (
        <MetaFieldClosed
            isMainView={isMainView}
            boxIndex={boxIndex}
            field={field}
            boxId={boxId}
            fieldIndex={fieldIndex}
            parentFieldIndex={parentFieldIndex}
            parentFieldId={parentFieldId}
            parentBlockId={parentBlockId}
        />
    );
};

MetaField.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string,
    isMainView: PropTypes.bool.isRequired
};

export default MetaField;