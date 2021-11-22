import {useNode} from "@craftjs/core";
import ColorPicker from "../../SettingsPanel/Form/ColorPicker";
import React from "react";
import {Icon} from "@iconify/react";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import ChooseIcon from "../../SettingsPanel/Form/ChooseIcon";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {squaresToString} from "../../../../../utils/strings";
import Measure from "../../SettingsPanel/Form/Measure";

export const CustomIcon = ({icon, fontSize, color, background, borderColor, borderThickness, borderRadius, width, height, padding}) => {

    return (
        <KeyboardInteractiveElement display="inline-block">
            <span
                style={{
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: (typeof padding !== 'undefined') ? squaresToString(padding) : null,
                    borderStyle: (borderThickness) ? "solid" : "hidden",
                    borderRadius: (typeof borderRadius !== 'undefined') ? squaresToString(borderRadius) : null,
                    borderColor: `${borderColor}`,
                    borderWidth: borderThickness ? borderThickness : "hidden",
                    background: background ? background : "transparent",
                    width: width,
                    height: height,
                }}
            >
                <Icon
                    width={`${fontSize !== null && typeof fontSize !== 'undefined' ? fontSize : "16px"}`}
                    icon={icon}
                    color={color}
                />
            </span>
        </KeyboardInteractiveElement>
    );
};

const CustomIconSettings = () => {
    const { actions: {setProp}, icon, fontSize, color, background, borderColor, borderThickness, borderRadius, width, height, padding } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        color: node.data.props.color,
        icon: node.data.props.icon,
        background: node.data.props.background,
        borderColor: node.data.props.borderColor,
        borderThickness: node.data.props.borderThickness,
        borderRadius: node.data.props.borderRadius,
        width: node.data.props.width,
        height: node.data.props.height,
        padding: node.data.props.padding,
    }));

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Choose icon</label>
                <ChooseIcon
                    value={icon}
                    onChange={(obj) => {
                        setProp(props => props.icon = obj.value );
                    } }
                />
            </div>
            <div className="acpt-form-group">
                <label>Color</label>
                <ColorPicker
                    value={color}
                    onChange={(color) => setProp(props => props.color = color) }
                />
            </div>
            <div className="acpt-form-group">
                <label>Font size</label>
                <Measure
                    value={fontSize}
                    onChange={(value) => {
                        setProp(props => props.fontSize = value);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Background Color</label>
                <ColorPicker
                    value={background ? background : ''}
                    onChange={(color) => setProp(props => props.background = color) }
                />
            </div>
            <div className="acpt-form-group">
                <label>Border Color</label>
                <ColorPicker
                    value={borderColor ? borderColor : ''}
                    onChange={(color) => setProp(props => props.borderColor = color) }
                />
            </div>
            <div className="acpt-form-group">
                <label>Border thickness</label>
                <input
                    type="number"
                    min={0}
                    step={1}
                    className="acpt-form-control"
                    defaultValue={borderThickness}
                    onChange={(e) => {
                        const borderThicknessValue = e.currentTarget.value;
                        setProp(props => props.borderThickness = borderThicknessValue);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Border radius</label>
                <FourSquarePixel
                    value={borderRadius}
                    onChange={(values) => {
                        setProp(props => props.borderRadius = values);
                    }}
                />
            </div>
            <div className="space-between">
                <div className="acpt-form-group pr-1">
                    <label>Width</label>
                    <Measure
                        value={width}
                        onChange={(value) => {
                            setProp(props => props.width = value);
                        }}
                    />
                </div>
                <div className="acpt-form-group pl-1">
                    <label>Height</label>
                    <Measure
                        value={height}
                        onChange={(value) => {
                            setProp(props => props.height = value);
                        }}
                    />
                </div>
            </div>
            <div className="acpt-form-group">
                <label>Padding</label>
                <FourSquarePixel
                    value={padding}
                    onChange={(values) => {
                        setProp(props => props.padding = values);
                    }}
                />
            </div>
        </div>
    )
};

CustomIcon.craft = {
    displayName: "Custom Icon",
    props: {
        icon: "bx:bx-star",
        color: "#01dcae",
    },
    related: {
        settings: CustomIconSettings
    }
};
