import React from "react";
import metaFields from "../../data/metaFields";
import {ADDRESS, COLOR, DATE, GALLERY, IMAGE, TOGGLE, URL, VIDEO} from "../../../App/constants/fields";
import WidthAndHeightSelect from "./Inputs/WidthAndHeightInput";
import TargetSelect from "./Inputs/TargetSelect";
import ShortcodeIcon from "./ShortcodeIcon";
import {isEmpty} from "../../../App/utils/objects";
import DateFormatSelect from "./Inputs/DateFormatSelect";
import ElementsSelect from "./Inputs/ElementsSelect";

const { SelectControl } = wp.components;

const ShortcodeBlock = ({props, updateType, updateWidth, updateHeight, updateTarget, updateDateFormat, updateElements}) => {

    const group1 = [ADDRESS, IMAGE, VIDEO, COLOR, TOGGLE];
    const group2 = [URL];
    const group3 = [DATE];
    const group4 = [GALLERY];

    return (
        <div className="acpt-block">
            <div className="controls">
                <SelectControl
                    label="Select meta box field"
                    value={props.attributes.value}
                    options = {metaFields}
                    onChange={(value) => updateType(value)}
                />
                { (group1.includes(props.attributes.type)) ? <WidthAndHeightSelect props={props} updateWidth={updateWidth} updateHeight={updateHeight} /> : null }
                { (group2.includes(props.attributes.type)) ? <TargetSelect props={props} updateTarget={updateTarget} /> : null }
                { (group3.includes(props.attributes.type)) ? <DateFormatSelect props={props} updateDateFormat={updateDateFormat} /> : null }
                { (group4.includes(props.attributes.type)) ? <ElementsSelect props={props} updateElements={updateElements} updateWidth={updateWidth} updateHeight={updateHeight} /> : null }
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