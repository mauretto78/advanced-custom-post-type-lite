import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from "react-redux";
import {useFormContext} from "react-hook-form";
import {CSS} from "@dnd-kit/utilities";
import {useDroppable} from "@dnd-kit/core";
import {useSortable} from "@dnd-kit/sortable";
import {setActiveBox, unsetActiveElement} from "../../../redux/reducers/metaStateSlice.jsx";
import CanvasBoxHeader from "./CanvasBoxHeader.jsx";
import CanvasElement from "./CanvasElement.jsx";
import useTranslation from "../../../hooks/useTranslation.jsx";
import {metaBoxProps} from "../../../props/metaProps.js";
import {releaseSaveIsClosed, savedIsClosed, saveIsClosed} from "../../../utils/localStorage.jsx";

const CanvasBox = ({box, boxIndex}) => {

    const dispatch   = useDispatch();
    const {activeBox} = useSelector(state => state.metaState);
    const isActive   = activeBox?.id === box.id;

    // Mirrors CanvasElement.jsx's field-level hasErrors -- a colliding box
    // name/label (checkIfNameIsValid / alphanumericallyValid / required) gets
    // the same red-border treatment as a field with an error.
    const {formState: {errors}} = useFormContext();
    const hasErrors = !!errors?.boxes?.[boxIndex]?.name || !!errors?.boxes?.[boxIndex]?.label;

    // Sortable for box reordering
    const {setNodeRef, isDragging, transform, transition, listeners, attributes} = useSortable({
        id: box.id,
        data: {box, fromCanvasBox: true}
    });

    // Drop zone for fields dropped directly onto the box
    const fieldsDrop = useDroppable({
        id: box.id + '-fields-drop',
        data: {boxId: box.id, boxIndex, isBoxFieldsArea: true}
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    const rootFields = (box.fields ?? []).filter(f => !f.parentId && !f.blockId);

    const handleBoxClick = (e) => {
        e.stopPropagation();
        dispatch(setActiveBox({id: box.id, index: boxIndex}));
        dispatch(unsetActiveElement());
    };

    const [isExpanded, setIsExpanded] = useState(!savedIsClosed(box.id));

    /**
     * Toggles the expansion state of a UI element and performs related actions.
     *
     * When the current state is expanded, calling this function will collapse
     * the element and invoke the `saveIsClosed` function with a unique identifier.
     * If the current state is collapsed, the function will expand the element and
     * invoke the `releaseSaveIsClosed` function with the same identifier.
     *
     * This function is typically used to manage the expanded or collapsed state
     * of a UI component, as well as to persist or release the state information
     * through associated actions.
     */
    const handleExpand = () => {
        setIsExpanded(!isExpanded);

        if(isExpanded) {
            saveIsClosed(box.id);
        } else {
            releaseSaveIsClosed(box.id);
        }
    }

    return (
        <div
            ref={setNodeRef}
            id={box.id}
            style={style}
            data-testid={`canvas-box-${box.id}`}
            className={`canvas-box bg-white b-rounded w-100 ${hasErrors ? 'with-danger-border' : isActive ? 'with-primary-border' : 'with-border'}`}
        >
            <CanvasBoxHeader
                box={box}
                boxIndex={boxIndex}
                listeners={listeners}
                attributes={attributes}
                isActive={isActive}
                hasErrors={hasErrors}
                onClick={handleBoxClick}
                isExpanded={isExpanded}
                setIsExpanded={handleExpand}
            />
            {isExpanded ? (
                <div
                    ref={fieldsDrop.setNodeRef}
                    className={`canvas-box-fields p-12 flex`}
                    style={{flexWrap: "wrap", minHeight: "80px"}}
                >
                    {rootFields.length === 0 && (
                        <div className={`flex-absolute-center b-rounded m-12 w-100 p-24 bg-pale-gray ${fieldsDrop.isOver ? 'with-primary-border' : 'with-border'}`}>
                        <span className="color-medium-gray">
                            {useTranslation(fieldsDrop.isOver ? "Release" : "Drop fields here")}
                        </span>
                        </div>
                    )}
                    {rootFields.map((field, fi) => (
                        <CanvasElement
                            key={field.id}
                            field={field}
                            boxId={box.id}
                            boxIndex={boxIndex}
                            fieldIndex={fi}
                        />
                    ))}
                </div>
            ) : (
                <div className="p-24">
                    {rootFields.length} fields inside this box
                </div>
            )}
        </div>
    );
};

CanvasBox.propTypes = {
    box:      PropTypes.shape(metaBoxProps).isRequired,
    boxIndex: PropTypes.number.isRequired,
};

export default CanvasBox;
