import React from "react";
import metaFields from "../../data/metaFields";
import ShortcodeIcon from "./ShortcodeIcon";
import {isEmpty} from "../../../App/utils/objects";

const { SelectControl } = wp.components;

const ShortcodeBlock = ({props, updateType}) => {

    return (
        <div className="acpt-block">
            <div className="controls">
                <SelectControl
                    label="Select meta box field"
                    value={props.attributes.value}
                    options = {metaFields}
                    onChange={(value) => updateType(value)}
                />
            </div>
            {!isEmpty(props.attributes.content) && (
                <p className="shortcode">
                    {props.attributes.type !== 'default' && (
                        <span className="icon">
                            <ShortcodeIcon type={props.attributes.type} />
                        </span>
                    )}
                    {props.attributes.content}
                </p>
            )}
        </div>
    );
};

export default ShortcodeBlock;