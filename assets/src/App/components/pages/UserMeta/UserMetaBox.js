import React, {useState} from 'react';
import UserMetaBoxHeader from "./UserMetaBoxHeader";
import UserMetaBoxBody from "./UserMetaBoxBody";
import {Icon} from "@iconify/react";
import {useDispatch} from "react-redux";
import {createUserMetaField} from "../../../redux/actions/userMetaStateActions";
import {isMetaClosed, saveMetaIsClosed} from "../../../utils/localStorage";

const UserMetaBox = ({id, position, dragHandle, register}) => {

    // manage global state
    const dispatch = useDispatch();

    // manage local state
    const [closed, setClosed] = useState(isMetaClosed(id));
    const toggleClose = () => {
        setClosed(!closed);
        saveMetaIsClosed(id, closed);
    };

    return(
        <div className="acpt-box-card">
            <UserMetaBoxHeader
                id={id}
                position={position}
                dragHandle={dragHandle}
                register={register}
                toggleClose={toggleClose}
            />
            <div className={`elements-wrapper ${closed ? 'hidden' : 'visible' }`}>
                <UserMetaBoxBody id={id} />
            </div>
            {!closed && (
                <a
                    className="add-field-link"
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        dispatch(createUserMetaField(id));
                    }}
                >
                    <Icon icon="bx:bx-plus-circle" /> Add field
                </a>
            )}
        </div>
    )
};

export default UserMetaBox;