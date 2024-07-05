import React from "react";
import PropTypes from 'prop-types';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";
import {useFormContext, useWatch} from "react-hook-form";
import ElementSelector from "../../BulkActions/ElementSelector";

const ProductDataFieldSortableTab = ({index, field, activeTab = 0, onClick}) => {

    // manage form state
    const { control } = useFormContext();
    const watchedName = useWatch({
        control,
        name: `fields.${index}.name`
    });

    // DND-kit
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: field.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    return (
        <div
            id={field.id}
            className={`flex-between s-8 tab ${activeTab === index ? 'active' : ''}`}
            ref={setNodeRef}
            style={style}
            onClick={() => {
                if(onClick){
                    onClick(index);
                }
            }}
        >
            <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
            </span>
            <ElementSelector
                element={{
                    id: field.id,
                }}
            />
            <span className="text-ellipsis">
                {watchedName ? watchedName : field.name}
            </span>
        </div>
    );
};

ProductDataFieldSortableTab.propTypes = {
    index: PropTypes.number.isRequired,
    field: PropTypes.object.isRequired,
    activeTab: PropTypes.number,
    onClick: PropTypes.func,
};

export default ProductDataFieldSortableTab;
