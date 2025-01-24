import React from "react";
import PropTypes from 'prop-types';
import {useFormContext, useWatch} from "react-hook-form";
import {scrollToId} from "../../../../utils/scroll";
import {styleVariants} from "../../../../constants/styles";
import Badge from "../../../../components/Badge";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";

const QuickNavigationField = ({field, index}) => {

    const { control } = useFormContext();
    const watchedBoxName = useWatch({
        control,
        name: `fields.${index}.name`
    });

    // DND-kit
    const {attributes, listeners, setNodeRef, isDragging, transform} = useSortable({id: field.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    return (
        <div
            className="tree-el flex-between s-8"
            key={field.id}
            ref={setNodeRef}
            style={style}
        >
            <div className="i-flex-center s-8">
                <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                    <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                </span>
                <span
                    className="text-ellipsis cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToId(`${field.id}`);
                    }}
                >
                    {watchedBoxName ? watchedBoxName : field.name}
                </span>
            </div>
            <Badge style={styleVariants.SECONDARY}>
                F
            </Badge>
        </div>
    );
};

QuickNavigationField.propTypes = {
    field: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default QuickNavigationField;