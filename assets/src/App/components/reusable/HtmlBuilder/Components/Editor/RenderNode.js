import {useEditor, useNode} from '@craftjs/core';
import React, {useCallback, useEffect, useRef} from 'react';
import ReactDOM from "react-dom";
import {Icon} from "@iconify/react";

export const RenderNode = ({render}) => {

    const { id } = useNode();
    const { actions, query, isActive } = useEditor((state) => ({
        isActive: state.nodes[id].events.selected,
    }));

    /**
     * Check if there are deletable descendants
     * @param id
     * @return {number}
     */
    const thereAreNotDeletableDescendants = (id) => {

        let deletableDescendants = 0;

        const node = query.node(id);
        const nodeObject = node.get();
        const descendants = node.descendants();

        if((typeof nodeObject.data.props.isDeletable !== 'undefined') && nodeObject.data.props.isDeletable === false){
            deletableDescendants++;
        }

        descendants.map((child)=>{
            deletableDescendants = deletableDescendants + thereAreNotDeletableDescendants(child);
        });

        return deletableDescendants;
    };

    const {
        isHover,
        dom,
        name,
        moveable,
        deletable,
        connectors: { drag },
        parent,
        next,
        props
    } = useNode((node) => ({
        isHover: node.events.hovered,
        dom: node.dom,
        name: node.data.custom.displayName || node.data.displayName,
        moveable: query.node(node.id).isDraggable(),
        deletable: thereAreNotDeletableDescendants(id) === 0,
        parent: node.data.parent,
        next: (query.node(id).descendants().length > 0) ? query.node(id).descendants()[0] : null,
        props: node.data.props,
    }));

    const getPos = useCallback((dom) => {
        const { top, left, bottom } = dom
            ? dom.getBoundingClientRect()
            : { top: 0, left: 0, bottom: 0 };
        return {
            top: `${top > 0 ? top - 30 : bottom}px`,
            left: `${left + 15}px`,
        };
    }, []);

    const currentRef = useRef();

    useEffect(() => {
        if (dom) {
            if ( isActive ) {
                dom.classList.remove('component-selected-hover');
                dom.classList.add('component-selected-active');
            } else if ( isHover ) {
                dom.classList.remove('component-selected-active');
                dom.classList.add('component-selected-hover');
            } else {
                dom.classList.remove('component-selected-active');
                dom.classList.remove('component-selected-hover');
            }
        }
    }, [dom, isActive, isHover]);

    const scroll = useCallback(() => {
        const { current: currentDOM } = currentRef;

        if (!currentDOM) return;
        const { top, left } = getPos(dom);
        currentDOM.style.top = top;
        currentDOM.style.left = left;
    }, [dom, getPos]);

    useEffect(() => {
        window.addEventListener('scroll', scroll);

        return () => {
            window.removeEventListener('scroll', scroll);
        };
    }, [scroll]);

    return (
        <React.Fragment>
            {(isHover || isActive)
                ? ReactDOM.createPortal(
                    <div
                        ref={currentRef}
                        className="element-indicator"
                        style={{
                            position: "fixed",
                            left: getPos(dom).left,
                            top: getPos(dom).top,
                            zIndex: 9999,
                        }}
                    >
                        <span className="name mr-2">{name}</span>
                        {moveable ? (
                            <a className="mr-1 cursor-move" ref={drag}>
                                <Icon icon="bx:bx-move" width="18px" />
                            </a>
                        ) : null}
                        <React.Fragment>
                            {parent && (
                                <a
                                    className="mr-1 cursor-pointer"
                                    onClick={() => {
                                        actions.selectNode(parent);
                                    }}
                                >
                                    <Icon icon="bx:bx-up-arrow-alt" width="18px" />
                                </a>
                            )}
                            {next && (
                                <a
                                    className="mr-1 cursor-pointer"
                                    onClick={() => {
                                        actions.selectNode(next);
                                    }}
                                >
                                    <Icon icon="bx:bx-down-arrow-alt" width="18px" />
                                </a>
                            )}
                        </React.Fragment>
                        {deletable ? (
                            <a
                                className="cursor-pointer"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    actions.delete(id);
                                }}
                            >
                                <Icon icon="bx:bx-trash" width="18px" />
                            </a>
                        ) : null}
                    </div>,
                    document.querySelector('.acpt-html-builder')
                )
                : null}
            {render}
        </React.Fragment>
    );
};
