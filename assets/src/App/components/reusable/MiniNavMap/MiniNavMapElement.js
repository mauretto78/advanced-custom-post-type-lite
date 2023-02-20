import React, {useState} from 'react';
import {Icon} from "@iconify/react";
import {scrollToElement, scrollToId} from "../../../utils/scroll";

const MiniNavMapElement = ( {value, isActiveId, setActiveId}) => {

    const [isClosed, setClosed] = useState(false);

    return (
        <div className="mini-map-element">
            <div className="box">
                <a href="#"
                    onClick={e => {
                        e.preventDefault();
                        setClosed(!isClosed);
                    }}
                >
                    <Icon icon={`bx:bx-chevron-${isClosed ? 'up' : 'down'}`} width="18px"/>
                </a>
                <a
                    href="#"
                    className={`title ${(isActiveId === value.id) ? 'active' : ''}`}
                    onClick={e => {
                    e.preventDefault();
                    scrollToId(value.id);
                    setActiveId(value.id);
                }}>
                    {value.title ? value.title : value.name }
                </a>
            </div>
            {value.fields && value.fields.length > 0 && (
                <ul className={isClosed ? 'closed' : 'open'}>
                    {value.fields.map((field, index)=>{
                        return (
                            <li className={field.parentId ? 'is-child' : ''} key={index}>
                                <a
                                    href="#"
                                    className={(isActiveId === field.id) ? 'active' : ''}
                                    onClick={e => {
                                        e.preventDefault();
                                        scrollToId(field.id);
                                        setActiveId(value.id);
                                    }}
                                >
                                    {field.name}
                                </a>
                            </li>
                        );

                    })}
                </ul>
            )}
        </div>
    );
};

export default MiniNavMapElement;