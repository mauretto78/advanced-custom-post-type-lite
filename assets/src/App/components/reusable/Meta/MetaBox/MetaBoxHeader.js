import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {duplicateMetaBox, updateBoxTitle} from "../../../../redux/actions/metaStateActions";
import {filterById, filterByLabel} from "../../../../utils/objects";
import {Icon} from "@iconify/react";
import Tippy from "../../../reusable/Tippy";
import DeleteMetaBoxModal from "./Modal/DeleteMetaBoxModal";
import {metaTypes} from "../../../../constants/metaTypes";

const MetaBoxHeader = ({id, position, dragHandle, toggleClose, isSaved}) => {

    // manage global state
    const dispatch = useDispatch();
    const {fetched: fetchedMeta} = useSelector(state => state.fetchMetaReducer);
    const {validationErrors, values, selectedElement} = useSelector(state => state.metaStateReducer);
    const {loading: settingsLoading, fetched: settings} = useSelector(state => state.fetchSettingsReducer);
    const box = filterById(values, id);
    const deleteMetadataOption = filterByLabel(settings, 'key', 'delete_metadata').value;

    const handleTitleChange = (title) => {
        dispatch(updateBoxTitle(id, title));
    };

    // manage local state
    const value = (typeof box !== 'undefined') ? box.title : 'Meta box title';
    const [titleIsVisible, setTitleIsVisible] = useState(true);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const hasErrors = typeof validationErrors[id] !== 'undefined';

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

    // if using keyboard navigation set title visible
    useEffect(() => {
        setTitleIsVisible(selectedElement !== box.id);
    }, [selectedElement]);

    return(
        <React.Fragment>
            <DeleteMetaBoxModal
                id={id}
                deleteMetadataOption={deleteMetadataOption}
                setModalVisible={setDeleteModalVisible}
                modalVisible={deleteModalVisible}
                boxName={value}
            />
            <div className="acpt-card__header">
                <div className="acpt-card__inner">
                    <div className="acpt-meta-box">
                        <div className="space-between">
                            <h3 className="vertical-center">
                                {dragHandle}
                                {(titleIsVisible) ? (
                                    <span
                                        className="flex-center"
                                        onDoubleClick={() => {
                                            setTitleIsVisible(false)
                                        }}
                                    >
                                        {value ? <span>{value}</span> : <span className="error-message">You must specify a title</span> }
                                        <span className="ml-1 acpt-badge">
                                            <span className="label">
                                                {box.fields ? box.fields.length : 0}
                                            </span>
                                        </span>
                                        <span className="double-click-tip">
                                            <Icon icon="akar-icons:arrow-left" width="12px" />
                                            double click on title to edit
                                        </span>
                                    </span>
                                ) : (
                                    <input
                                        id={`meta_box_title_${box.id}`}
                                        ref={node}
                                        type='text'
                                        className={`acpt-form-control ${hasErrors && 'has-errors'}`}
                                        defaultValue={value}
                                        autoFocus={true}
                                        onChange={(event) => handleTitleChange(event.target.value) }
                                        onKeyDown={(event) => handleDoubleClickOnTitle(event)}
                                    />
                                )}
                            </h3>
                            <div className="icons">
                                <Tippy title="Delete this meta box">
                                    <a
                                        className=""
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setDeleteModalVisible(!deleteModalVisible);
                                        }}
                                    >
                                        <Icon icon="bx:bx-trash" width="18px"/>
                                    </a>
                                </Tippy>
                                <Tippy title="Hide/show this meta box">
                                    <a
                                        className=""
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleClose();
                                        } }
                                    >
                                        <Icon icon="bx:bx-expand-alt" width="18px"/>
                                    </a>
                                </Tippy>
                            </div>
                        </div>
                        {hasErrors && (
                            <div className="errors">
                                <ul>
                                    {validationErrors[id].map((validationError, index)=>(
                                        <li key={index}>
                                            {validationError.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default MetaBoxHeader;