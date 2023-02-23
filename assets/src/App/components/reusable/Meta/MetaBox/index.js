import React, {useState} from 'react';
import MetaBoxHeader from "./MetaBoxHeader";
import MetaBoxBody from "./MetaBoxBody";
import {createField, selectElement} from "../../../../redux/actions/metaStateActions";
import {useDispatch, useSelector} from "react-redux";
import {isMetaClosed, saveMetaIsClosed} from "../../../../utils/localStorage";

const MetaBox = ({id, position, dragHandle, register, isSaved}) => {

    // manage global state
    const dispatch = useDispatch();
    const {selectedElement} = useSelector(state => state.metaStateReducer);

    // manage local state
    const [closed, setClosed] = useState(isMetaClosed(id));
    const toggleClose = () => {
        setClosed(!closed);
        saveMetaIsClosed(id, closed);
    };

    return(
        <div
            className={`acpt-box-card ${id === selectedElement ? 'selected' : ''}`}
            id={id}
        >
            <MetaBoxHeader
                id={id}
                position={position}
                dragHandle={dragHandle}
                register={register}
                toggleClose={toggleClose}
                isSaved={isSaved}
            />
            <div className={`elements-wrapper ${closed ? 'hidden' : 'visible' }`}>
                <MetaBoxBody id={id} />
            </div>
            {!closed && (
                <div className="add-field-link-wrapper">
                    <a
                        className="acpt-btn acpt-btn-primary-o"
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            dispatch(createField(id));
                        }}
                    >
                        Add field
                    </a>
                </div>
            )}
        </div>
    )
};

export default MetaBox;