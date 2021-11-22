import React from 'react';
import {useEditor} from "@craftjs/core";
import {Icon} from "@iconify/react";

const SettingsPanel = () => {

    const { actions, selected, query } = useEditor((state) => {
        const currentNode = state.events.selected;
        const values = currentNode.values();
        const [currentNodeId] = values;

        let selected;
        if ( typeof currentNodeId !== 'undefined' && typeof state.nodes[currentNodeId] !== 'undefined' ) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.name ? state.nodes[currentNodeId].data.name : state.nodes[currentNodeId].data.displayName,
                settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
                isDeletable: (typeof state.nodes[currentNodeId].data.props.isDeletable !== 'undefined') ? state.nodes[currentNodeId].data.props.isDeletable : query.node(currentNodeId).isDeletable()
            };
        }

        return {
            selected
        }
    });

    return (selected) ? (
        <div className="acpt-card">
            <div className="acpt-card__header">
                <div className="acpt-card__inner">
                    <h3 className="m-0 p-0">
                        <Icon icon="bx:bx-edit" color="#02c39a" width="20px" />
                        &nbsp;
                        Customize {selected.displayName ? selected.displayName : selected.name}
                    </h3>
                </div>
            </div>
            <div className="scroll-div">
                <div className="acpt-card__inner">
                    {
                        selected.settings && React.createElement(selected.settings)
                    }
                    {selected.isDeletable ? (
                        <button
                            className="acpt-btn acpt-btn-primary-o"
                            onClick={() => {
                                actions.delete(selected.id);
                            }}>
                            <Icon icon="bx:bx-trash" width="24px" />
                            Delete
                        </button>
                    ) : null }
                </div>
            </div>
        </div>
    ) : null;
};

export default SettingsPanel;