import React from "react";
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";
import MetaBlockOpen from "./MetaBlockOpen";
import MetaBlockClosed from "./MetaBlockClosed";

const MetaBlock = ({blockIndex, block, boxIndex, boxId, parentFieldIndex, parentFieldId, isMainView}) => {

    // manage global state
    const {closedElements} = useSelector(state => state.metaState);

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {

        const filter = closedElements.filter(e => e === block.id);

        if(typeof filter === 'undefined'){
            return false;
        }

        return filter.length > 0;
    };

    if(!isClosed()){
        return (
            <MetaBlockOpen
                isMainView={isMainView}
                blockIndex={blockIndex}
                block={block}
                boxIndex={boxIndex}
                boxId={boxId}
                parentFieldIndex={parentFieldIndex}
                parentFieldId={parentFieldId}
            />
        );
    }

    return (
        <MetaBlockClosed
            isMainView={isMainView}
            blockIndex={blockIndex}
            block={block}
            boxIndex={boxIndex}
            boxId={boxId}
            parentFieldIndex={parentFieldIndex}
            parentFieldId={parentFieldId}
        />
    );
};

MetaBlock.propTypes = {
    isMainView: PropTypes.bool,
    blockIndex: PropTypes.number.isRequired,
    block: PropTypes.object.isRequired,
    boxId: PropTypes.string.isRequired,
    boxIndex: PropTypes.string.isRequired,
    parentFieldIndex: PropTypes.number.isRequired,
    parentFieldId: PropTypes.string.isRequired
};

export default MetaBlock;