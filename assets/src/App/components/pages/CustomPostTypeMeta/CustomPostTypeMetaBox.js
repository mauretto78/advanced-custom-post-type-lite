import React, {useState} from 'react';
import CustomPostTypeMetaBoxHeader from "./CustomPostTypeMetaBoxHeader";
import CustomPostTypeMetaBoxBody from "./CustomPostTypeMetaBoxBody";
import {createField} from "../../../redux/actions/metaStateActions";
import {Icon} from "@iconify/react";
import {useDispatch} from "react-redux";
import {isMetaClosed, saveMetaIsClosed} from "../../../utils/localStorage";

const CustomPostTypeMetaBox = ({id, position, dragHandle, register}) => {

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
            <CustomPostTypeMetaBoxHeader
                id={id}
                position={position}
                dragHandle={dragHandle}
                register={register}
                toggleClose={toggleClose}
            />
            <div className={`elements-wrapper ${closed ? 'hidden' : 'visible' }`}>
                <CustomPostTypeMetaBoxBody id={id} />
            </div>
            {!closed && (
                <a
                    className="add-field-link"
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        dispatch(createField(id));
                    }}
                >
                    <Icon icon="bx:bx-plus-circle" /> Add field
                </a>
            )}
        </div>
    )
};

export default CustomPostTypeMetaBox;