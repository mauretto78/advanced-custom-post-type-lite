import React, {useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {get, useFormContext} from "react-hook-form";
import {mediumGray} from "../../utils/colors.jsx";
import {debounce} from "../../utils/debounce.jsx";
import {slugifyName} from "../../utils/slugifyName.jsx";
import {useOutsideClick} from "../../hooks/useOutsideClick.jsx";
import useTranslation from "../../hooks/useTranslation.jsx";
import Tooltip from "../Tooltip";

/**
 * Click-to-edit inline editor for a name/label pair (with optional auto-slug),
 * used by every canvas builder (meta boxes/fields/blocks, CCT columns/blocks,
 * dynamic-block controls, WooCommerce product fields).
 *
 * Pure react-hook-form -- reads/writes via useFormContext(), no Redux, no
 * persistence of its own (the enclosing form's submit persists the values).
 *
 * The edit-mode wrapper stops key/click propagation so the canvas card's
 * ancestor "select on Enter/Space" keydown handler never fires while typing
 * (that handler's `e.preventDefault()` on Space was eating the character).
 */
const NameLabelInlineEdit = ({
    formId,
    name,
    label = '',
    hasErrors = false,
    nameOnly = false,
    primaryField = 'label',
    autoSlug = true,
    showAutoSlugToggle = true,
    nameReadOnly = false,
    nameValidate = {},
    labelValidate = {},
    nameRequired = true,
    maxLength = 255,
    labelPlaceholder,
    namePlaceholder,
    renameTitle,
}) => {

    const {register, setValue, formState: {errors}} = useFormContext();

    const [isEditing, setIsEditing] = useState(false);
    // Starts ON for a brand-new/untouched name, but stays OFF for a name that
    // was already customized away from what auto-slug would generate -- so
    // simply reopening an existing item to tweak its label can't silently
    // wipe an intentional custom slug (see handleNameChange below for the
    // same-session case).
    const [autoSlugOn, setAutoSlugOn] = useState(() => autoSlug && (!name || name === slugifyName(label)));
    const editRef = useRef(null);

    useOutsideClick([editRef], () => setIsEditing(false));

    const namePath  = formId('name');
    const labelPath = nameOnly ? null : formId('label');

    const canAutoSlug = autoSlug && !nameOnly && !nameReadOnly;
    const showToggle  = canAutoSlug && showAutoSlugToggle;

    const nameErr  = get(errors, namePath);
    const labelErr = labelPath ? get(errors, labelPath) : null;
    const showNameError = hasErrors || !!nameErr;

    // Debounced re-slug from the label -- recreated only when the path changes.
    const reslug = useMemo(
        () => debounce(
            (value) => setValue(namePath, slugifyName(value), {shouldValidate: true, shouldDirty: true}),
            300
        ),
        [namePath, setValue]
    );
    useEffect(() => () => reslug.cancel(), [reslug]);

    const handleLabelChange = (e) => {
        if (autoSlugOn && canAutoSlug) {
            reslug(e.target.value);
        }
    };

    const handleNameChange = (e) => {
        if (!nameReadOnly) {
            setValue(namePath, slugifyName(e.target.value), {shouldDirty: true});
            // A direct edit to the slug is a deliberate customization -- stop
            // auto-syncing it from the label for the rest of this session.
            setAutoSlugOn(false);
        }
    };

    // Keeps Space/Enter typed in the inputs from bubbling to the canvas card's
    // ancestor onKeyDown (which preventDefault()s Space and toggles selection).
    const handleInputKeyDown = (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
            setIsEditing(false);
        }
    };

    const activate = () => setIsEditing(true);

    if (!isEditing) {
        // primary is styled as the bold label; never fall back to the slug here
        // -- a blank label just means no bold text (the slug still shows, gray,
        // as the secondary). Falling back to `name` rendered the slug with
        // bold-black label styling.
        const primary = nameOnly
            ? name
            : (primaryField === 'name' ? name : label);
        let secondary = nameOnly
            ? null
            : (primaryField === 'name' ? label : name);

        return (
            <span
                className="i-flex-center s-4 cursor-text canvas-name-label"
                role="button"
                tabIndex={0}
                aria-label={useTranslation("Rename")}
                onClick={e => { e.stopPropagation(); activate(); }}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        activate();
                    }
                }}
            >
                {primary ? (
                    <strong className={`canvas-text-truncate ${hasErrors ? "color-danger" : "text-bold color-black"}`} title={primary}>{primary}</strong>
                ) : null}
                {secondary ? (
                    <span className={`canvas-text-truncate canvas-text-truncate--secondary ${hasErrors ? "color-danger" : "color-medium-gray"}`} title={secondary}>{secondary}</span>
                ) : null}
                <Tooltip
                    label={<Icon icon="bx:pencil" width={14} color={mediumGray()} aria-hidden={true} className="cursor-pointer" />}
                    tip={renameTitle ?? useTranslation("Click to rename")}
                    icon={false}
                />
            </span>
        );
    }

    return (
        <span
            ref={editRef}
            className="flex-column s-4"
            role="presentation"
            onClick={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}
        >
            <span className="i-flex-center s-4">
                {!nameOnly && (
                    <input
                        data-testid={`inline-input-${labelPath}`}
                        defaultValue={label}
                        // eslint-disable-next-line jsx-a11y/no-autofocus -- deliberate: focuses the rename input only after the user's own click/keyboard activation opened this edit group, not on page load
                        autoFocus
                        placeholder={labelPlaceholder ?? useTranslation("Field label")}
                        className="form-control xs"
                        style={{width: '110px'}}
                        onChangeCapture={handleLabelChange}
                        onKeyDown={handleInputKeyDown}
                        {...register(labelPath, {
                            maxLength: {value: maxLength, message: `max length is ${maxLength}`},
                            validate: labelValidate,
                        })}
                    />
                )}
                <input
                    data-testid={`inline-input-${namePath}`}
                    defaultValue={name}
                    readOnly={nameReadOnly}
                    // eslint-disable-next-line jsx-a11y/no-autofocus -- deliberate: only autofocuses in name-only mode where there is no label input to receive focus first
                    autoFocus={nameOnly}
                    placeholder={namePlaceholder ?? useTranslation("Field slug")}
                    className={`form-control xs ${showNameError ? 'has-errors' : ''}`}
                    style={{width: '110px'}}
                    onChangeCapture={handleNameChange}
                    onKeyDown={handleInputKeyDown}
                    {...register(namePath, {
                        ...(nameRequired ? {required: useTranslation("This field is mandatory")} : {}),
                        maxLength: {value: maxLength, message: `max length is ${maxLength}`},
                        validate: nameValidate,
                    })}
                />
                {showToggle && (
                    <button
                        type="button"
                        className="btn-reset font-size-xs"
                        style={{fontWeight: "normal", whiteSpace: "nowrap"}}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); setAutoSlugOn(v => !v); }}
                    >
                        {useTranslation(autoSlugOn ? 'Auto slug ON' : 'Auto slug OFF')}
                    </button>
                )}
            </span>
            {(nameErr || labelErr) && (
                <span data-testid={`inline-error-${namePath}`} className="color-danger font-size-xs">
                    {(nameErr || labelErr).message}
                </span>
            )}
        </span>
    );
};

NameLabelInlineEdit.propTypes = {
    formId:             PropTypes.func.isRequired,
    name:               PropTypes.string.isRequired,
    label:              PropTypes.string,
    hasErrors:          PropTypes.bool,
    nameOnly:           PropTypes.bool,
    primaryField:       PropTypes.oneOf(['name', 'label']),
    autoSlug:           PropTypes.bool,
    showAutoSlugToggle: PropTypes.bool,
    nameReadOnly:       PropTypes.bool,
    nameValidate:       PropTypes.object,
    labelValidate:      PropTypes.object,
    nameRequired:       PropTypes.bool,
    maxLength:          PropTypes.number,
    labelPlaceholder:   PropTypes.string,
    namePlaceholder:    PropTypes.string,
    renameTitle:        PropTypes.string,
};

export default NameLabelInlineEdit;
