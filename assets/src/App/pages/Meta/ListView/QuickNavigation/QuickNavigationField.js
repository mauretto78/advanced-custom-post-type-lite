import React from "react";
import PropTypes from 'prop-types';
import Badge from "../../../../components/Badge";
import {styleVariants} from "../../../../constants/styles";
import {useFormContext, useWatch} from "react-hook-form";
import {scrollToId} from "../../../../utils/scroll";
import {getFormId} from "../../../../utils/fields";
import {useSelector} from "react-redux";
import QuickNavigationBlock from "./QuickNavigationBlock";

const QuickNavigationField = ({level, boxIndex, fieldIndex, boxId, parentField, field}) => {

    // manage global state
    const {group} = useSelector(state => state.metaState);

    // manage form state
    const { control } = useFormContext();
    const watchedFieldName = useWatch({
        control,
        name: `${getFormId(group.boxes, boxId, field.id)}.name`
    });

    return (
        <React.Fragment>
            <div key={field.id} className={`tree-el flex-between s-8`} style={{"--level": level}}>
                <span
                    className={`cursor-pointer text-ellipsis`}
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToId(`lazy-${field.id}`);
                    }}
                >
                    {watchedFieldName ? watchedFieldName : field.name}
                </span>
                <Badge style={parentField ? styleVariants.WARNING : styleVariants.SECONDARY}>
                    {parentField ? "C" : "F" }
                </Badge>
            </div>
            {field.children && field.children.length > 0 && field.children.map((child, childIndex) => (
                <QuickNavigationField
                    level={level+1}
                    boxIndex={boxIndex}
                    fieldIndex={childIndex}
                    boxId={boxId}
                    parentField={field}
                    field={child}
                />
            ))}
            {field.blocks && field.blocks.map((block, blockIndex) => (
                <QuickNavigationBlock
                    boxIndex={boxIndex}
                    block={block}
                    blockIndex={blockIndex}
                    boxId={boxId}
                    level={level+1}
                    parentField={field}
                    fieldIndex={fieldIndex}
                />
            ))}
        </React.Fragment>
    );
};

QuickNavigationField.propTypes = {
    level: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    parentField: PropTypes.object,
};

export default QuickNavigationField;