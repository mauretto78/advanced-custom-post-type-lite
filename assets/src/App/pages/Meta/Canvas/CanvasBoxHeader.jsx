import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {dangerColor, grayColor, primaryColor} from "../../../utils/colors.jsx";
import {useDispatch} from "react-redux";
import {addBox, addField, unsetActiveBox} from "../../../redux/reducers/metaStateSlice.jsx";
import DeleteMetaBoxModal from "../Modal/DeleteMetaBoxModal.jsx";
import useTranslation from "../../../hooks/useTranslation.jsx";
import {fieldTypes} from "../../../constants/fields.jsx";
import useWatchedFieldValue from "../../../hooks/useWatchedFieldValue.jsx";
import {createField} from "../../../utils/fields.jsx";
import {cloneBox} from "../../../utils/cloners.jsx";
import {useFieldArray, useFormContext, useWatch} from "react-hook-form";
import Tooltip from "../../../components/Tooltip/index.jsx";
import {metaBoxProps} from "../../../props/metaProps.js";
import NameLabelInlineEdit from "../../../components/CanvasLayout/NameLabelInlineEdit.jsx";
import CopyMetaBoxModal from "../Modal/CopyMetaBoxModal.jsx";
import useCanvasElementSelection, {INLINE_EDIT_GUARD} from "../../../hooks/useCanvasElementSelection.jsx";
import {alphanumericallyValid} from "../../../utils/validation.jsx";
import useMetaBoxNameValidator from "../../../hooks/useMetaBoxNameValidator.jsx";

const CanvasBoxHeader = ({box, boxIndex, listeners, attributes, isActive, hasErrors, onClick, isExpanded, setIsExpanded}) => {

    const dispatch = useDispatch();

    // Live label/name for the inline editor's read-only display.
    const boxLabel = useWatchedFieldValue(`boxes.${boxIndex}.label`, box.label);
    const boxName  = useWatchedFieldValue(`boxes.${boxIndex}.name`, box.name);
    const { control } = useFormContext();

    // Shared with the sidebar BoxSettingsPanel so a box renamed directly on the
    // canvas is checked against the same site-wide uniqueness rule (#duplicate names).
    const checkIfNameIsValid = useMetaBoxNameValidator({boxIndex, box});

    const handleAddField = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addField({
            boxId: box.id,
            parentFieldId: null,
            parentBlockId: null,
            field: createField(fieldTypes.TEXT, box.id)
        }));
    };

    const watchedBox = useWatch({
        control,
        name: `boxes.${boxIndex}`
    });

    const { append } = useFieldArray({
        control,
        name: "boxes",
    });



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

    // #1279: the header is a plain <div>, NOT role="button" — a widget role here
    // made it a `nested-interactive` container (drag handle + inline rename +
    // action buttons all live inside). onClick stays for pointer select; keyboard
    // select is selection-follows-focus, but only for the header's own real
    // controls — focusing an action <button> or the drag handle must not select
    // the box (mirrors the previous onKeyDown guard + CanvasBoxHeader.test.js).
    const {onSelectFocus} = useCanvasElementSelection({
        isActive: !!isActive,
        onSelect: onClick,
        focusGuard: '.handle, button, ' + INLINE_EDIT_GUARD,
    });

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
            className={`canvas-box-header canvas-header-row flex-between p-12 b-bottom-1 s-8 cursor-pointer canvas-select-target ${isActive ? 'active' : ''}`}
            onClick={onClick}
            onFocus={onSelectFocus}
        >
            <div className="i-flex-center s-8 canvas-header-row__title">
                <span
                    className="cursor-move handle"
                    data-testid={`box-drag-handle-${box.id}`}
                    aria-label={boxName ? `${useTranslation("Drag to reorder")}: ${boxName}` : useTranslation("Drag to reorder")}
                    {...(attributes ?? {})}
                    {...(listeners ?? {})}
                >
                    <Icon icon="bx:dots-vertical-rounded" color={grayColor()} width={18} />
                </span>
                <NameLabelInlineEdit
                    formId={(key) => `boxes.${boxIndex}.${key}`}
                    name={boxName}
                    label={boxLabel}
                    primaryField="label"
                    hasErrors={hasErrors}
                    nameValidate={{alphanumericallyValid, checkIfNameIsValid}}
                    labelPlaceholder={useTranslation("Box label")}
                    namePlaceholder={useTranslation("Box slug")}
                />
            </div>
            {/* Mirrors the card's own hasErrors-driven border (CanvasBox.jsx) so the
                action icons read as part of the same error state, not just the name. */}
            <div className={`i-flex-center s-4 canvas-header-row__actions ${hasErrors ? 'with-danger-border' : ''}`}>
                <Tooltip
                    label={
                        <button
                            type="button"
                            className="btn-reset"
                            aria-label={useTranslation("Add field")}
                            onClick={handleAddField}
                        >
                            <Icon icon="bx:plus-circle" width={18} color={primaryColor()} />
                        </button>
                    }
                    tip={useTranslation("Add field")}
                    icon={false}
                />
                <Tooltip
                    label={
                        <button
                            type="button"
                            className="btn-reset"
                            aria-label={useTranslation("Duplicate this meta box")}
                            onClick={e => {
                                e.preventDefault();
                                const duplicatedBox = cloneBox(watchedBox);
                                dispatch(addBox(duplicatedBox));
                                append(duplicatedBox);
                            }}
                        >
                            <Icon icon="bx:duplicate" width={18} color={primaryColor()} />
                        </button>
                    }
                    tip={useTranslation("Duplicate this meta box")}
                    icon={false}
                />
                {canCopyTheBox() && (
                    <Tooltip
                        label={
                            <CopyMetaBoxModal box={box} />
                        }
                        tip={useTranslation("Copy this meta box")}
                        icon={false}
                    />
                )}
                <Tooltip
                    label={
                        <DeleteMetaBoxModal
                            index={boxIndex}
                            boxId={box.id}
                            onAfterDelete={() => dispatch(unsetActiveBox())}
                            trigger={
                                <button
                                    type="button"
                                    className="btn-reset"
                                    aria-label={useTranslation("Delete box")}
                                >
                                    <Icon icon="bx-trash" width={18} color={dangerColor()} />
                                </button>
                            }
                        />
                    }
                    tip={useTranslation("Delete box")}
                    icon={false}
                />
                <Tooltip
                    label={
                        <button
                            type="button"
                            className="btn-reset cursor-pointer"
                            aria-label={useTranslation(isExpanded ? "Collapse" : "Expand")}
                            onClick={() => setIsExpanded(!isExpanded)}
                            onKeyDown={e => {
                                if(e.key === 'Enter' || e.key === ' '){
                                    e.preventDefault();
                                    setIsExpanded(!isExpanded);
                                }
                            }}
                        >
                            <Icon
                                icon={isExpanded ? "bx:chevron-up" : "bx:chevron-down"}
                                width={14}
                                color={primaryColor()}
                            />
                        </button>

                    }
                    tip={useTranslation(isExpanded ? "Collapse" : "Expand")}
                    icon={false}
                />
            </div>
        </div>
    );
};

CanvasBoxHeader.propTypes = {
    box:       PropTypes.shape(metaBoxProps).isRequired,
    boxIndex:  PropTypes.number.isRequired,
    listeners: PropTypes.object,
    attributes: PropTypes.object,
    isActive:  PropTypes.bool,
    hasErrors: PropTypes.bool,
    onClick:   PropTypes.func.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    setIsExpanded: PropTypes.func.isRequired,
};

export default CanvasBoxHeader;
