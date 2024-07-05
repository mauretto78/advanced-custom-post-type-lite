import React from "react";
import PropTypes from 'prop-types';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";
import Badge from "../../../components/Badge";
import {styleVariants} from "../../../constants/styles";
import {useFormContext, useWatch} from "react-hook-form";
import ElementSelector from "../BulkActions/ElementSelector";

const PageSortableTab = ({index, page, activeTab = 0, onClick}) => {

    // manage form state
    const { control } = useFormContext();
    const watchedName = useWatch({
        control,
        name: `pages.${index}.pageTitle`
    });

    // DND-kit
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: page.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    return (
        <div
            id={page.id}
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
                element={page}
            />
            <span className="text-ellipsis">
                {watchedName ? watchedName : page.pageTitle}
            </span>
            <Badge style={index === activeTab ? styleVariants.SECONDARY : styleVariants.DISABLED}>
                {page.children ? page.children.length : 0}
            </Badge>
        </div>
    );
};

PageSortableTab.propTypes = {
    index: PropTypes.number.isRequired,
    page: PropTypes.object.isRequired,
    activeTab: PropTypes.number,
};

export default PageSortableTab;
