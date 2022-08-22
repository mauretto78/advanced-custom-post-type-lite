import React, {useEffect, useRef, useState} from "react";
import {Icon} from "@iconify/react";

const Modal = ( {title, children, visible}) => {

    // manage local state
    const didMountRef = useRef(false);
    const [closed, setClosed] = useState(!visible);

    useEffect(() => {
        if (didMountRef.current){
            setClosed(!closed);
        } else {
            didMountRef.current = true;
        }
    }, [visible]);

    if(closed){
        return null;
    }

    return(
        <React.Fragment>
            <div className={`acpt-modal ${closed ? 'modal-hidden' : 'modal-open'}`}>
                <div className="acpt-card mb-0">
                    <div className="acpt-card__header">
                        <div className="acpt-card__inner">
                            <div className="space-between">
                                <h3 className="vertical-center">{title}</h3>
                                <div className="icons">
                                    <a
                                        className="modal-close-icon"
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setClosed(!closed);
                                        }}
                                    >
                                        <Icon icon="bx:bx-x" width="18px" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="acpt-card__body">
                        <div className="acpt-card__inner text-center">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="acpt-overlay"
                onClick={(e) => {
                    e.preventDefault();
                    setClosed(!closed);
                }}
            />
        </React.Fragment>
    )
};

export default Modal;