import React, {useEffect, useState} from 'react';
import ToolboxElement from "./ToolboxElement";
import {useEditor} from "@craftjs/core";
import {Icon} from "@iconify/react";
import {getComponents} from "../Components";

const Toolbox = ({visible, postId, postMeta, sidebars, headersAndFooters}) => {

    const { currentNode } = useEditor((state) => {
        const currentNode = state.events.selected;

        return {currentNode};
    });

    const [components, setComponents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(()=>{
        setComponents(getComponents(postId, postMeta, searchTerm, sidebars, headersAndFooters));
    }, [postId, postMeta, searchTerm]);

    return (currentNode.size === 0) ?
        <div className="acpt-card mb-2">
            <div className="acpt-card__header">
                <div className="acpt-card__inner">
                    <div className="space-between">
                        <h3 className="m-0 p-0">
                            <Icon icon="bx:bx-cog" color="#02c39a" width="20px" />
                            &nbsp;
                            Elements
                        </h3>
                        <div>
                            <input
                                style={{width: "230px"}}
                                type="text"
                                className="hidden-xs acpt-form-control"
                                placeholder="Search element"
                                defaultValue={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="scroll-div">
                <div className="elements-group-wrapper">
                    {components.map((group, index) => (
                        <ToolboxElement visible={visible} index={index} group={group} />
                    ))}
                </div>
            </div>
        </div>
    : null;
};

export default Toolbox;