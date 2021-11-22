import React from "react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {useNode} from "@craftjs/core";
import TextAlign from "../../SettingsPanel/Form/TextAlign";
import FontWeight from "../../SettingsPanel/Form/FontWeight";
import FontStyle from "../../SettingsPanel/Form/FontStyle";
import ColorPicker from "../../SettingsPanel/Form/ColorPicker";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import Measure from "../../SettingsPanel/Form/Measure";
import {squaresToString} from "../../../../../utils/strings";

export const ACPTBreadcrumbs = ({borderRadius, borderThickness, borderColor, background, margin, padding, textAlign, fontWeight, fontStyle, fontSize, css}) => {
    return (
        <KeyboardInteractiveElement display="block">
            <div className="element-container" style={{
                margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
            }}>
                <span className="title">[ACPT Breadcrumbs]</span>
                <span className="row inline"/>
                <span className="slash inline"/>
                <span className="row inline" style={{width: "160px"}}/>
                <span className="slash inline"/>
                <span className="row inline last" style={{width: "180px"}}/>
            </div>
        </KeyboardInteractiveElement>
    );
};

const ACPTBreadcrumbsSettings = () => {
    const { actions: {setProp}, background, borderColor, borderThickness, borderRadius, margin, padding, textAlign, fontWeight,fontStyle, fontSize, delimiter, css } = useNode((node) => ({
        textAlign: node.data.props.textAlign,
        fontSize: node.data.props.fontSize,
        fontWeight: node.data.props.fontWeight,
        fontStyle: node.data.props.fontStyle,
        borderThickness: node.data.props.borderThickness,
        borderColor: node.data.props.borderColor,
        background: node.data.props.background,
        borderRadius: node.data.props.borderRadius,
        margin: node.data.props.margin,
        padding: node.data.props.padding,
        delimiter: node.data.props.delimiter,
        css: node.data.props.css,
    }));

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Text align</label>
                <TextAlign
                    value={textAlign}
                    onChange={(value) => {
                        setProp(props => props.textAlign = value);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <div className="mr-2" style={{display: "inline-block"}}>
                    <label>Font weight</label>
                    <FontWeight
                        value={fontWeight}
                        onChange={(value) => {
                            setProp(props => props.fontWeight = value);
                        }}
                    />
                </div>
                <div style={{display: "inline-block"}}>
                    <label>Font style</label>
                    <FontStyle
                        value={fontStyle}
                        onChange={(value) => {
                            setProp(props => props.fontStyle = value);
                        }}
                    />
                </div>
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
                    onChange={(values) => {
                        setProp(props => props.padding = values);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Delimiter</label>
                <input
                    type="text"
                    maxLength={3}
                    className="acpt-form-control"
                    defaultValue={delimiter}
                    onChange={(e) => {
                        const delimiterValue = e.currentTarget.value;
                        setProp(props => props.delimiter = delimiterValue);
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

ACPTBreadcrumbs.craft = {
    displayName: '[ACPT Breadcrumbs]',
    props: {
        margin: [0,0,20,0, 'px'],
        css: ""
    },
    related: {
        settings: ACPTBreadcrumbsSettings
    },
};