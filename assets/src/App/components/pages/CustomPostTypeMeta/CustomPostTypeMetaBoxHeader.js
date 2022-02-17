import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteBox, updateBoxTitle} from "../../../redux/actions/metaStateActions";
import Modal from "../../reusable/Modal";
import {filterById} from "../../../utils/objects";
import {Icon} from "@iconify/react";

const CustomPostTypeMetaBoxHeader = ({id, position, dragHandle, toggleClose}) => {

    // manage global state
    const dispatch = useDispatch();
    const {values} = useSelector(state => state.metaStateReducer);
    const box = filterById(values, id);

    const handleTitleChange = (title) => {
        dispatch(updateBoxTitle(id, title));
    };

    // manage local state
    const value = (typeof box !== 'undefined') ? box.title : 'Meta box title';
    const [titleIsVisible, setTitleIsVisible] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // handle double click on title
    const node = useRef();
    const handleDoubleClickOnTitle = (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            setTitleIsVisible(true);
            event.preventDefault();
            event.stopPropagation();
        }
    };

    // handle click outside title box
    const handleOutsideTitleBoxClick = e => {
        if (node.current !== e.target) {
            setTitleIsVisible(true);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideTitleBoxClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideTitleBoxClick);
        };
    }, []);

    return(
        <React.Fragment>
            <Modal title={`Confirm deleting box "${value}"`} visible={modalVisible}>
                <p>Every field inside of it will be deleted. Are you sure?</p>
                <p>
                    <a
                        href="#"
                        className="acpt-btn acpt-btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(deleteBox(id));
                        }}
                    >
                        Yes
                    </a>
                    &nbsp;
                    <a
                        href="#"
                        className="acpt-btn acpt-btn-primary-o"
                        onClick={(e) => {
                            e.preventDefault();
                            setModalVisible(!modalVisible);
                        }}
                    >
                        No
                    </a>
                </p>
            </Modal>
            <div className="acpt-card__header">
                <div className="acpt-card__inner">
                    <div className="acpt-meta-box">
                        <div className="space-between">
                        <h3 className="vertical-center">
                            {dragHandle}
                            {titleIsVisible ? (
                                <span
                                    onDoubleClick={() => {
                                        setTitleIsVisible(false)
                                    }}
                                >
                                    {value ? value : <span className="error-message">You must specify a title</span> }
                                    {box.fields && <span className="ml-1 acpt-badge"><span className="label">{box.fields.length}</span></span>}
                                    <span className="double-click-tip">
                                        <Icon icon="akar-icons:arrow-left" width="12px" />
                                        double click on title to edit
                                    </span>
                            </span>
                            ) : (
                                <input
                                    ref={node}
                                    type='text'
                                    className="acpt-form-control"
                                    defaultValue={value}
                                    onChange={(event) => handleTitleChange(event.target.value) }
                                    onKeyDown={(event) => handleDoubleClickOnTitle(event)}
                                />
                            )}
                        </h3>
                        <div className="icons">
                            <a
                                className=""
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Icon icon="bx:bx-trash" width="20px"/>
                            </a>
                            &nbsp;
                            <a
                                className=""
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleClose();
                                } }
                            >
                                <Icon icon="bx:bx-expand-alt" width="20px"/>
                            </a>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default CustomPostTypeMetaBoxHeader;