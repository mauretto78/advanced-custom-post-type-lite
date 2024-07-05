import React from "react";
import PropTypes from 'prop-types';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";
import Badge from "../../../components/Badge";
import {styleVariants} from "../../../constants/styles";
import {useFormContext, useWatch} from "react-hook-form";
import ElementSelector from "../BulkActions/ElementSelector";
import {useSelector} from "react-redux";

const BoxSortableTab = ({index, box, activeTab = 0, onClick}) => {

    // manage global state
    const {selectedElementsType} = useSelector(state => state.metaState);

    // manage form state
    const { control } = useFormContext();
    const watchedBoxName = useWatch({
        control,
        name: `boxes.${index}.name`
    });

    // DND-kit
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: box.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    /**
     *
     * @return {boolean}
     */
    const canCopyTheBox = () => {

        if(typeof box.isSaved !== 'undefined' && box.isSaved === false){
            return false
        }

        return true;
    };

    return (
        <div
            id={box.id}
            className={`flex-between s-8 tab ${activeTab === index ? 'active' : ''}`}
            ref={setNodeRef}
            style={style}
            onClick={() => {
                if(onClick){
                    onClick(index);
                }
            }}
        >
            <span
                className="cursor-move top-2 handle" {...attributes} {...listeners}
                onMouseDownCapture={() => {
                    if(onClick){
                        onClick(index);
                    }
                }}
            >
                <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
            </span>
            {selectedElementsType !== 'field' && selectedElementsType !== 'block' && canCopyTheBox() && (
                <ElementSelector
                    elementType="box"
                    element={{
                        id: box.id
                    }}
                />
            )}
            <span className="text-ellipsis">
                {watchedBoxName ? watchedBoxName : box.name}
            </span>
            <Badge style={index === activeTab ? styleVariants.SECONDARY : styleVariants.DISABLED}>
                {box.fields ? box.fields.length : 0}
            </Badge>
        </div>
    );
};

BoxSortableTab.propTypes = {
    index: PropTypes.number.isRequired,
    box: PropTypes.object.isRequired,
    activeTab: PropTypes.number,
};

export default BoxSortableTab;
