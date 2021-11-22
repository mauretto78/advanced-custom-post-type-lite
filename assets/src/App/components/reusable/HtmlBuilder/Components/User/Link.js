import React from "react";
import {useNode} from "@craftjs/core";
import ColorPicker from "../../SettingsPanel/Form/ColorPicker";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {squaresToString} from "../../../../../utils/strings";
import Measure from "../../SettingsPanel/Form/Measure";
import TargetLink from "../../SettingsPanel/Form/TargetLink";
import ChooseIcon from "../../SettingsPanel/Form/ChooseIcon";
import {Icon} from "@iconify/react";

export const Link = ({text, href, color, borderThickness, borderColor, background, borderRadius, fontSize, target, margin, padding, display, icon, css}) => {

    const defaultHref = href ? href : '#';
    const defaultText = text ? text : 'Link text';

    return (
        <KeyboardInteractiveElement display={display ? display : "inline-block"}>
            <a
                onClick={e => e.preventDefault()}
                href={defaultHref}
                target={target}
                style={{
                    textAlign: "center",
                    display: display ? display : 'inline-block',
                    margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                    padding: (typeof padding !== 'undefined') ? squaresToString(padding) : null,
                    borderStyle: (borderThickness) ? "solid" : "hidden",
                    borderRadius: (typeof borderRadius !== 'undefined') ? squaresToString(borderRadius) : null,
                    borderColor: `${borderColor}`,
                    borderWidth: borderThickness ? borderThickness : "hidden",
                    fontSize: `${fontSize !== null && typeof fontSize !== 'undefined' ? fontSize : "14px"}`,
                    background: background ? background : "transparent",
                    color: `${color}`
                }}
                className={css}
            >
                <span style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    {icon && (
                        <React.Fragment>
                            <Icon
                                width={`${fontSize !== null && typeof fontSize !== 'undefined' ? fontSize : "16px"}`}
                                icon={icon}
                                color={color}
                            />
                            &nbsp;
                        </React.Fragment>
                    )}
                    {defaultText}
                </span>
            </a>
        </KeyboardInteractiveElement>
    )
};

const LinkSettings = () => {
    const { actions: {setProp}, text, href, color, fontSize, target, borderColor, borderThickness,background, borderRadius, margin, padding, display, icon, css } = useNode((node) => ({
        display: node.data.props.display,
        text: node.data.props.text,
        href: node.data.props.href,
        fontSize: node.data.props.fontSize,
        borderColor: node.data.props.borderColor,
        color: node.data.props.color,
        background: node.data.props.background,
        borderThickness: node.data.props.borderThickness,
        borderRadius: node.data.props.borderRadius,
        margin: node.data.props.margin,
        padding: node.data.props.padding,
        target: node.data.props.target,
        icon: node.data.props.icon,
        css: node.data.props.css
    }));

    const defaultHref = href ? href : '#';
    const defaultText = text ? text : 'Link text';

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Text</label>
                <input
                    type="text"
                    className="acpt-form-control"
                    defaultValue={defaultText}
                    onChange={(e) => {
                        const defaultTextValue = e.currentTarget.value;
                        setProp(props => props.text = defaultTextValue);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Link</label>
                <input
                    type="link"
                    className="acpt-form-control"
                    defaultValue={defaultHref}
                    onChange={(e) => {
                        const defaultHrefValue = e.currentTarget.value;
                        setProp(props => props.href = defaultHrefValue);
                    }}
                />
            </div>
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
                <label>Background Color</label>
                <ColorPicker
                    value={background ? background : ''}
                    onChange={(color) => setProp(props => props.background = color) }
                />
            </div>
            <div className="acpt-form-group">
                <label>Color</label>
                <ColorPicker
                    value={color ? color : ''}
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
            <div className="acpt-form-group">
                <label>Margins</label>
                <FourSquarePixel
                    value={margin}
                    defaultLocked={false}
                    onChange={(values) => {
                        setProp(props => props.margin = values);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Padding</label>
                <FourSquarePixel
                    value={padding}
                    defaultLocked={true}
                    onChange={(values) => {
                        setProp(props => props.padding = values);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Additional CSS classes</label>
                <input
                    type="text"
                    className="acpt-form-control"
                    defaultValue={css}
                    onChange={(e) => {
                        const cssValue = e.currentTarget.value;
                        setProp(props => props.css = cssValue);
                    }}
                />
            </div>
        </div>
    )
};

Link.craft = {
    props: {
        link: "#",
        text: "Link text",
        css: "",
    },
    related: {
        settings: LinkSettings
    }
};