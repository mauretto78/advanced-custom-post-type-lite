import React from "react";
import PropTypes from 'prop-types';
import {fieldSettings} from "../../../../../../constants/fields";
import VerticalBlockList from "./VerticalBlockList";
import useTranslation from "../../../../../../hooks/useTranslation";
import {useAutoAnimate} from "@formkit/auto-animate/react";

const BlockList = ({boxId, boxIndex, parentFieldIndex, parentFieldId, blocks, nestingLevel}) => {

    const addBlockEnabled = nestingLevel < fieldSettings.MAX_NESTING;

    // auto-animate
    const [parent] = useAutoAnimate();

    return (
        <div
            ref={parent}
            className="mt-24"
        >
            <label className="form-label">
                {useTranslation("Blocks")}
            </label>
            <VerticalBlockList
                addBlockEnabled={addBlockEnabled}
                boxIndex={boxIndex}
                boxId={boxId}
                parentFieldIndex={parentFieldIndex}
                parentFieldId={parentFieldId}
                blocks={blocks}
            />
        </div>
    );
};

BlockList.propTypes = {
    boxId: PropTypes.string.isRequired,
    parentFieldId: PropTypes.string.isRequired,
    boxIndex: PropTypes.number.isRequired,
    parentFieldIndex: PropTypes.number.isRequired,
    blocks: PropTypes.array.isRequired,
    nestingLevel: PropTypes.number.isRequired,
};

export default BlockList;