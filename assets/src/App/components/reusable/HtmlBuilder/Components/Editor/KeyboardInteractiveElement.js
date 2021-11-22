import React from "react";
import {useEditor, useNode} from "@craftjs/core";

export const KeyboardInteractiveElement = ({children, display, className, width, height}) => {

    const {id} = useNode();
    const { connectors: {connect, drag} } = useNode();
    const { actions, query, isActive } = useEditor((state) => ({
        isActive: state.nodes[id].events.selected
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

    const handleKeyboardInteraction = (e) => {

        const keyCode = e.keyCode;
        const node = query.node(id);

        if(isActive){
            switch (keyCode) {
                // Delete key
                case 46:
                    if(thereAreNotDeletableDescendants(id) === 0){
                        actions.delete(id);
                    }
                    break;

                // @TODO move up
                // @TODO move down
                // actions.move(nodeId: NodeId, targetParentId: NodeId, index: number) => void
                // Move a Node to the specified parent Node at the given index.
            }
        }
    };

    return (
        <div
            className={`component ${className ? className : ''}`}
            ref={ref => connect(drag(ref))}
            style={{
                display: display ? display : 'block',
                width: width ? width : null,
                height: height ? height : null,
            }}
            tabIndex="0"
            onKeyDownCapture={e => handleKeyboardInteraction(e)}
        >
            {children}
        </div>
    );
};

export default KeyboardInteractiveElement;