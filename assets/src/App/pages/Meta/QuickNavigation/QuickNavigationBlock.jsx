import React from "react";
import PropTypes from 'prop-types';
import Badge from "../../../components/Badge";
import {styleVariants} from "../../../constants/styles";
import {useFormContext, useWatch} from "react-hook-form";
import {scrollToId} from "../../../utils/scroll";
import {getFormId} from "../../../utils/fields";
import {useSelector} from "react-redux";
import QuickNavigationField from "./QuickNavigationField";

const QuickNavigationBlock = ({level, boxIndex, fieldIndex, blockIndex, boxId, parentField, block}) => {

    // manage global state
    const {group} = useSelector(state => state.metaState);

    // manage form state
    const { control } = useFormContext();
    const watchedBlockName = useWatch({
        control,
        name: `${getFormId(group.boxes, boxId, parentField.id)}.blocks.${blockIndex}.name`
    });

    return (
        <React.Fragment>
            <div key={block.id} className={`tree-el flex-between s-8`} style={{"--level": level}}>
                <span
                    className={`cursor-pointer text-ellipsis`}
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToId(block.id);
                    }}
                >
                    {watchedBlockName ? watchedBlockName : block.name}
                </span>
                <Badge style={styleVariants.INFO}>
                    B
                </Badge>
            </div>
            {block.fields && block.fields.length > 0 && block.fields.map((child, childIndex) => (
                <QuickNavigationField
                    level={level+1}
                    boxIndex={boxIndex}
                    fieldIndex={childIndex}
                    boxId={boxId}
                    parentField={parentField}
                    field={child}
                />
            ))}
        </React.Fragment>
    );
};

QuickNavigationBlock.propTypes = {
    level: PropTypes.number.isRequired,
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    blockIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    block: PropTypes.object.isRequired,
    parentField: PropTypes.object.isRequired,
};

export default QuickNavigationBlock;