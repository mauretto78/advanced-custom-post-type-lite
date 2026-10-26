import React, {useEffect, useId, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {Icon} from "@iconify/react";
import PropTypes from 'prop-types';
import {useOutsideClick} from "../../hooks/useOutsideClick";
import {grayColor} from "../../utils/colors";
import useTranslation from "../../hooks/useTranslation";

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const Modal = ( {title, size = 'medium', visible = false, setVisible = null, textAlign = "left", padding = 24, buttons = [], testId, children}) => {

    // manage local state
    const didMountRef = useRef(false);
    const [closed, setClosed] = useState(!visible);
    const node = useRef();
    const previouslyFocusedRef = useRef(null);
    const titleId = useId();

    const handleClose = () => {
        setClosed(true);

        if(setVisible){
            setVisible(false);
        }
    };

    useEffect(() => {
        if (didMountRef.current){
            setClosed(!visible);
        } else {
            didMountRef.current = true;
        }
    }, [visible]);

    // initial focus on open + focus restore on close
    useEffect(() => {
        if(closed){
            if(previouslyFocusedRef.current){
                previouslyFocusedRef.current.focus();
                previouslyFocusedRef.current = null;
            }
            return;
        }

        previouslyFocusedRef.current = document.activeElement;
        node.current?.focus();
    }, [closed]);

    // Escape-to-close + minimal Tab focus trap
    useEffect(() => {
        if(closed){
            return;
        }

        const handleKeyDown = (e) => {
            if(e.key === 'Escape'){
                e.stopPropagation();
                handleClose();
                return;
            }

            if(e.key !== 'Tab' || !node.current){
                return;
            }

            const focusable = Array.from(node.current.querySelectorAll(FOCUSABLE_SELECTOR));

            if(focusable.length === 0){
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if(e.shiftKey && document.activeElement === first){
                e.preventDefault();
                last.focus();
            } else if(!e.shiftKey && document.activeElement === last){
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [closed]);

    useOutsideClick([node], handleClose);

    if(closed){
        return null;
    }

    return createPortal(
        // React events bubble through the portal's *React-tree* parent, not the
        // DOM parent -- so without this, an event from anywhere inside the modal
        // (a click on a <select>, a change on an input) reaches whatever handler
        // the component that renders <Modal> sits under. When that ancestor is a
        // canvas root that deselects on click (Meta/FormManager/CCT canvases) the
        // deselect unmounts the modal mid-interaction; when it is a <form onChange>
        // it flags the page dirty for edits the user never made. The modal is an
        // interaction boundary -- stop bubbling here.
        <div
            className="acpt-overlay"
            role="presentation"
            onClick={e => e.stopPropagation()}
            onChange={e => e.stopPropagation()}
        >
            <div
                ref={node}
                className={`acpt-modal ${size} ${closed ? 'modal-hidden' : 'modal-open'}`}
                data-testid={testId ? "modal-"+testId : null}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
            >
                <div className="acpt-modal-header flex-between">
                    <h3 id={titleId}>{title}</h3>
                    <button
                        type="button"
                        className="btn-reset modal-close-icon"
                        aria-label={useTranslation("Close")}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClose();
                        }}
                    >
                        <Icon icon="bx:bx-x" color={grayColor()} width={24} />
                    </button>
                </div>
                <div className={`acpt-modal-body p-${padding} text-${textAlign}`}>
                    {children}
                </div>
                {buttons.length > 0 && (
                    <div className="acpt-modal-footer">
                        <div className="i-flex-center s-8">
                            {buttons.map((button, index) => (
                                button.key !== null ? button : React.cloneElement(button, {key: index})
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.getElementById("acpt-admin-app-wrapper")
    );
};

Modal.propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    setVisible: PropTypes.func,
    padding: PropTypes.number,
    testId: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.element),
    textAlign: PropTypes.oneOf([
        'center',
        'left',
        'right',
    ]),
    size: PropTypes.oneOf([
        'small',
        'medium',
        'large',
    ]),
};

export default Modal;