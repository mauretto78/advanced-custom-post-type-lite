import React from "react";
import PropTypes from 'prop-types';
import Badge from "../../../components/Badge";
import {styleVariants} from "../../../constants/styles";
import {useFormContext, useWatch} from "react-hook-form";
import {scrollToId} from "../../../utils/scroll";
import {getFormId} from "../../../utils/fields";
import {useSelector} from "react-redux";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";

const QuickNavigationField = ({level, boxId, field}) => {

    // manage global state
    const {group} = useSelector(state => state.metaState);

    // DND-kit
    const {attributes, listeners, setNodeRef, isDragging, transform} = useSortable({id: field.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    // manage form state
    const { control } = useFormContext();
    const watchedFieldName = useWatch({
        control,
        name: `${getFormId(group.boxes, boxId, field.id)}.name`
    });

    return (
        <div
            key={field.id}
            className={`tree-el flex-between s-8`}
            ref={setNodeRef}
            style={style}
        >
            <div className="i-flex-center s-8">
                <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                    <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                </span>
                <span
                    className={`cursor-pointer text-ellipsis`}
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToId(`${field.id}`);
                    }}
                >
                    {watchedFieldName ? watchedFieldName : field.name}
                </span>
            </div>
            <Badge style={styleVariants.SECONDARY}>
                C
            </Badge>
        </div>
    );
};

QuickNavigationField.propTypes = {
    level: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
};

export default QuickNavigationField;