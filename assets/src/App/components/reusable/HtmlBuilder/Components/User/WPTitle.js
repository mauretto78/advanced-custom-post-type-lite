import React from "react";
import {useNode} from "@craftjs/core";
import {useSelector} from "react-redux";
import TextAlign from "../../SettingsPanel/Form/TextAlign";
import ColorPicker from "../../SettingsPanel/Form/ColorPicker";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {squaresToString} from "../../../../../utils/strings";
import Measure from "../../SettingsPanel/Form/Measure";
import HLevel from "../../SettingsPanel/Form/HLevel";

export const WPTitle = ({fontSize, color, level, margin, padding, textAlign, css}) => {

    const {fetched:postData, loading: postDataLoading} = useSelector(state => state.fetchPostDataReducer);

    const CustomTag = `${typeof level !== 'undefined' ? level : "h1"}`;

    return (
        <KeyboardInteractiveElement>
            <CustomTag className={css}
               style={{
                   textAlign: textAlign,
                   margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                   padding: (typeof padding !== 'undefined') ? squaresToString(padding) : null,
                   fontSize: `${fontSize !== null && typeof fontSize !== 'undefined' ? fontSize : null}`,
                   color: color ? color : '#000'
               }}
            >
                {postData.post_title}
            </CustomTag>
        </KeyboardInteractiveElement>
    );
};

const WPTitleSettings = () => {
    const { actions: {setProp}, fontSize, color, level, margin, padding, textAlign, css } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        color: node.data.props.color,
        level: node.data.props.level,
        margin: node.data.props.margin,
        padding: node.data.props.padding,
        textAlign: node.data.props.textAlign,
        css: node.data.props.css,
    }));

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Level</label>
                <HLevel
                    defaultValue={level}
                    onChange={(value) => {
                        setProp(props => props.level = value);
                    }}
                />
            </div>
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

WPTitle.craft = {
    displayName: '[wp-title]',
    props: {
        margin: [0,0,20,0, 'px'],
        padding: [0,0,0,0, 'px'],
    },
    related: {
        settings: WPTitleSettings
    }
};