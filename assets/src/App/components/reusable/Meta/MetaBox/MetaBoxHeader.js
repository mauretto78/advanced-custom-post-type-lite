import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {updateBoxTitle, updateBoxLabel} from "../../../../redux/actions/metaStateActions";
import {filterById, filterByLabel} from "../../../../utils/objects";
import {Icon} from "@iconify/react";
import Tippy from "../../../reusable/Tippy";
import DeleteMetaBoxModal from "./Modal/DeleteMetaBoxModal";

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

    const handleLabelChange = (label) => {
        dispatch(updateBoxLabel(id, label));
    };

    // manage local state
    const value = (typeof box !== 'undefined') ? box.title : 'meta_box_title';
    const label = (typeof box !== 'undefined') ? box.label : null;
    const [titleIsVisible, setTitleIsVisible] = useState(true);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const titleErrors = (typeof validationErrors[id] !== 'undefined') ? validationErrors[id].filter((element) => { return element.type === 'title'; }) : [];
    const labelErrors = (typeof validationErrors[id] !== 'undefined') ? validationErrors[id].filter((element) => { return element.type === 'label'; }) : [];

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
                                    >
                                        {value && <span>{value}</span>}
                                        {label && <span className="label">{label}</span>}
                                        <a
                                            href="#"
                                            className="acpt-btn acpt-btn-xs acpt-btn-primary-o"
                                            onClick={e => {
                                                e.preventDefault();
                                                setTitleIsVisible(false);
                                            }}
                                        >
                                            Edit
                                        </a>
                                    </span>
                                ) : (
                                    <div className="font-normal flex-center">
                                        <input
                                            id={`meta_box_title_${box.id}`}
                                            type='text'
                                            className={`acpt-form-control acpt-form-control-sm ${titleErrors.length > 0 && 'has-errors'}`}
                                            placeholder="Box name. Allowed chars: [a-z0-9_-]"
                                            defaultValue={value}
                                            autoFocus={true}
                                            onChange={(event) => handleTitleChange(event.target.value) }
                                        />
                                        <input
                                            id={`meta_box_label_${box.id}`}
                                            type="text"
                                            className={`acpt-form-control acpt-form-control-sm ${labelErrors.length > 0 && 'has-errors'}`}
                                            placeholder="Box label, non latin chars allowed."
                                            defaultValue={label}
                                            onChange={(event) => handleLabelChange(event.target.value) }
                                        />
                                        <button
                                            className="acpt-btn acpt-btn-primary-o"
                                            onClick={() => setTitleIsVisible(true)}
                                        >
                                            Save
                                        </button>
                                    </div>
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
                        {titleErrors.length > 0 && (
                            <div className="errors">
                                <ul>
                                    {titleErrors.map((validationError, index)=>(
                                        <li key={index}>
                                            {validationError.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {labelErrors.length > 0 && (
                            <div className="errors">
                                <ul>
                                    {labelErrors.map((validationError, index)=>(
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