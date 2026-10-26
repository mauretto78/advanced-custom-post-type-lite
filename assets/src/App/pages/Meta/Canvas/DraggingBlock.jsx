import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {grayColor, primaryColor} from "../../../utils/colors.jsx";
import {metaBlockProps} from "../../../props/metaProps.js";
import {maxWidthClassName} from "../../../utils/ui.jsx";

const DraggingBlock = ({block}) => {
    return (
        <div className="b-rounded with-border with-shadow bg-white" style={{borderLeft: `2px solid ${primaryColor()}`}}>
            <div className="flex-between p-space-btn">
                <div className="i-flex-center s-8">
                    <span className="cursor-move top-2 handle">
                        <Icon icon="bx:dots-vertical-rounded" color={grayColor()} width={18} />
                    </span>
                    <span className={`${maxWidthClassName(block.label)} text-bold color-black`}>{block.label}</span>
                    <span className={`${maxWidthClassName(block.name)} color-medium-gray font-size-sm`}>{block.name}</span>
                </div>
            </div>
        </div>
    );
};

DraggingBlock.propTypes = {
    block: PropTypes.shape(metaBlockProps).isRequired,
};

export default DraggingBlock;

