import React, {useState} from 'react';
import CustomPostTypeMetaBoxHeader from "./CustomPostTypeMetaBoxHeader";
import CustomPostTypeMetaBoxBody from "./CustomPostTypeMetaBoxBody";
import {createField} from "../../../redux/actions/metaStateActions";
import {Icon} from "@iconify/react";
import {useDispatch} from "react-redux";

const CustomPostTypeMetaBox = ({id, position, dragHandle, register}) => {

    // manage global state
    const dispatch = useDispatch();

    // manage local state
    const [closed, setClosed] = useState(false);
    const toggleClose = () => {
        setClosed(!closed);
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
        </div>
    )
};

export default CustomPostTypeMetaBox;