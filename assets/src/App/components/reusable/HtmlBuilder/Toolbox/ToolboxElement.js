import React, {useState} from 'react';
import {useEditor} from "@craftjs/core";
import {Icon} from "@iconify/react";

const ToolboxElement = ({index, visible, group}) => {

    const { connectors, query } = useEditor();

    // manage local state
    const [closed, setClosed] = useState(false);
    const toggleClose = () => {
        setClosed(!closed);
    };

    return ( group.elements.length > 0 &&
        <div className="element-group">
            <div className="element-group-header space-between">
                <h4>
                    {group.group}
                </h4>
                <div className="icons">
                    <a
                        className=""
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleClose();
                        } }
                    >
                        <Icon icon="bx:bx-expand-alt" width="20px" />
                    </a>
                </div>
            </div>
            {!closed && (
                <div className="elements">
                    {group.elements
                        .filter((component)=>{
                            return component.visible.includes(visible);
                        })
                        .map((element) =>(
                        <div className="element" ref={ref=> connectors.create(ref, element.component)}>
                            <span className="icon">
                                <Icon icon={`${element.icon}`} color="#02c39a" width="20px" />
                            </span>
                            <span className="name">
                                {element.name}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ToolboxElement;