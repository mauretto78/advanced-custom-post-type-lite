import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {Icon} from "@iconify/react";
import PropTypes from 'prop-types';
import Button from "../Button";
import {useOutsideClick} from "../../hooks/useOutsideClick";

const Modal = ( {title, size = 'medium', visible = false, textAlign = "left", padding = 24, buttons = [], testId, children}) => {

    // manage local state
    const didMountRef = useRef(false);
    const [closed, setClosed] = useState(!visible);
    const node = useRef();

    useEffect(() => {
        if (didMountRef.current){
            setClosed(!closed);
        } else {
            didMountRef.current = true;
        }
    }, [visible]);

    useOutsideClick(node, () => {
        setClosed(true);
    });

    if(closed){
        return null;
    }

    return createPortal(
        <div className="acpt-overlay">
            <div
                ref={node}
                className={`acpt-modal ${size} ${closed ? 'modal-hidden' : 'modal-open'}`}
                data-cy={testId ? "modal-"+testId : null}
            >
                <div className="acpt-modal-header flex-between">
                    <h3>{title}</h3>
                    <a
                        className="modal-close-icon"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setClosed(!closed);
                        }}
                    >
                        <Icon icon="bx:bx-x" color="#777" width={24} />
                    </a>
                </div>
                <div className={`acpt-modal-body p-${padding} text-${textAlign}`}>
                    {children}
                </div>
                {buttons.length > 0 && (
                    <div className="acpt-modal-footer">
                        <div className="i-flex-center s-8">
                            {buttons.map((button) => button)}
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.getElementById("acpt-admin-app")
    );
};

Modal.propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    padding: PropTypes.number,
    testId: PropTypes.string,
    buttons: PropTypes.arrayOf(Button),
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