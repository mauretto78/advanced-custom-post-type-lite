import React from "react";
import PropTypes from 'prop-types';
import {fieldSettings} from "../../../../../../constants/fields";
import VerticalBlockList from "./VerticalBlockList";
import HorizontalBlockList from "./HorizontalBlockList";

const BlockList = ({view, boxId, boxIndex, parentFieldIndex, parentFieldId, blocks, nestingLevel}) => {

    const addBlockEnabled = nestingLevel < fieldSettings.MAX_NESTING;

    return (
        <div className="mt-24">
            {view === 'list' ? (
                <VerticalBlockList
                    addBlockEnabled={addBlockEnabled}
                    boxIndex={boxIndex}
                    boxId={boxId}
                    parentFieldIndex={parentFieldIndex}
                    parentFieldId={parentFieldId}
                    blocks={blocks}
                />
            ) : (
                <HorizontalBlockList
                    addBlockEnabled={addBlockEnabled}
                    boxIndex={boxIndex}
                    boxId={boxId}
                    parentFieldIndex={parentFieldIndex}
                    parentFieldId={parentFieldId}
                    blocks={blocks}
                />
            )}
        </div>
    );
};

BlockList.propTypes = {
    view: PropTypes.oneOf([
        "list",
        "tabular"
    ]).isRequired,
    boxId: PropTypes.string.isRequired,
    parentFieldId: PropTypes.string.isRequired,
    boxIndex: PropTypes.number.isRequired,
    parentFieldIndex: PropTypes.number.isRequired,
    blocks: PropTypes.array.isRequired,
    nestingLevel: PropTypes.number.isRequired,
};

export default BlockList;