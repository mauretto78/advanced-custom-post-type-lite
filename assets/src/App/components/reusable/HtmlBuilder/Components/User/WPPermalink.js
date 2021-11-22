import React from "react";
import {useEditor, useNode} from "@craftjs/core";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {Void} from "./Void";
import TargetLink from "../../SettingsPanel/Form/TargetLink";

export const WPPermalink = ({target, display, children}) => {

    const { connectors: {connect, drag} } = useNode();
    const { actions } = useEditor();

    return (
        <KeyboardInteractiveElement display="block">
            <div className="element-container">
                <span className="title">WP Permalink</span>
                <div className="content">
                    {children ? children : <Void /> }
                </div>
            </div>
        </KeyboardInteractiveElement>
    )
};

const WPPermalinkSettings = () => {
    const { actions: {setProp}, display, target } = useNode((node) => ({
        target: node.data.props.target,
        display: node.data.props.display,
    }));

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Target</label>
                <TargetLink
                    value={target}
                    onChange={(value) => {
                        setProp(props => props.target = value);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Display</label>
                <select
                    className="acpt-form-control"
                    defaultValue={display}
                    onChange={(e) => {
                        const displayValue = e.currentTarget.value;
                        setProp(props => props.display = displayValue);
                    }}
                >
                    <option value="inline-block">inline-block</option>
                    <option value="block">block</option>
                </select>
            </div>
        </div>
    )
};

WPPermalink.craft = {
    displayName: '[wp-permalink]',
    props: {
        display: "inline-block",
        target: "_self"
    },
    related: {
        settings: WPPermalinkSettings
    }
};