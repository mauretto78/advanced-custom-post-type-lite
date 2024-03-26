import React from 'react';
import PropTypes from "prop-types";
import {useSortable} from "@dnd-kit/sortable";
import {useFormContext, useWatch} from "react-hook-form";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";
import ElementSelector from "../../BulkActions/ElementSelector";

const ChildrenTabularTabElement = ({page, isActive, parentPageIndex, index, onClick}) => {

    // manage form state
    const { control } = useFormContext();
    const watchedPageName = useWatch({
        control,
        name: `pages.${parentPageIndex}.children.${index}.menuTitle`
    });

    // DND-kit
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: page.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    return (
        <React.Fragment>
            <div
                className={`acpt-btn-switch ${isActive ? 'active' : ''}`}
                ref={setNodeRef}
                style={style}
                onClick={() => {
                    onClick(index);
                }}
            >
                <div className="i-flex-center s-8">
                    <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                        <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                    </span>
                    <ElementSelector
                        element={page}
                    />
                    <span
                        className="text-ellipsis"
                        style={{
                            maxWidth: "200px"
                        }}
                    >
                        {watchedPageName ? watchedPageName : page.menuTitle}
                    </span>
                </div>
            </div>
        </React.Fragment>
    );
};

ChildrenTabularTabElement.propTypes = {
    parentPageIndex: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
    page: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default ChildrenTabularTabElement;