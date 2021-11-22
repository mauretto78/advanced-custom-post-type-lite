import {useSelector} from "react-redux";
import React from "react";
import {useNode} from "@craftjs/core";
import ColorPicker from "../../SettingsPanel/Form/ColorPicker";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import TextAlign from "../../SettingsPanel/Form/TextAlign";
import DateObject from "react-date-object";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {squaresToString} from "../../../../../utils/strings";
import Measure from "../../SettingsPanel/Form/Measure";

export const WPDate = ({format, fontSize, color, margin, padding, textAlign, css}) => {

    const {fetched:postData, loading: postDataLoading} = useSelector(state => state.fetchPostDataReducer);

    const jsDate = new Date(postData.post_date);
    const renderedDate = new DateObject(jsDate).format(format);

    return (
        <KeyboardInteractiveElement display="inline-block">
            <div className={css}
                 style={{
                     textAlign: textAlign,
                     margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                     padding: (typeof padding !== 'undefined') ? squaresToString(padding) : null,
                     fontSize: `${fontSize !== null && typeof fontSize !== 'undefined' ? fontSize : "14px"}`,
                     color: color ? color : null
                 }}
            >
                {renderedDate}
            </div>
        </KeyboardInteractiveElement>
    );
};

const WPDateSettings = () => {
    const { actions: {setProp}, format, fontSize, color, margin, padding, textAlign, css } = useNode((node) => ({
        format: node.data.props.format,
        fontSize: node.data.props.fontSize,
        color: node.data.props.color,
        margin: node.data.props.margin,
        padding: node.data.props.padding,
        textAlign: node.data.props.textAlign,
        css: node.data.props.css,
    }));

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Format</label>
                <select
                    className="acpt-form-control"
                    defaultValue={format}
                    onChange={(e) => {
                        const formatValue = e.currentTarget.value;
                        setProp(props => props.format = formatValue);
                    }}
                >
                    <option value="DD-MMMM-YY">dd-mmm-yy (ex. 28-OCT-90)</option>
                    <option value="DD-MMMM-YYYY">dd-mmm-yyyy (ex. 28-OCT-1990)</option>
                    <option value="DD MMMM YY">dd mmm yy (ex. 28 OCT 90)</option>
                    <option value="DD MMMM YYYY">dd mmm yyyy (ex. 28 OCT 1990)</option>
                    <option value="MM/DD/YY">mm/dd/yy (ex. 10/28/90)</option>
                    <option value="MM/DD/YYYY">mm/dd/yyyy (ex. 10/28/1990)</option>
                    <option value="DD.MM.YY">dd.mm.yy (ex. 28.10.90)</option>
                    <option value="DD.MM.YYYY">dd.mm.yyyy (ex. 28.10.1990)</option>
                </select>
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

WPDate.craft = {
    displayName: '[wp-date]',
    props: {
        margin: [0,0,20,0, 'px'],
        padding: [0,0,0,0, 'px'],
        format: "MM/DD/YY"
    },
    related: {
        settings: WPDateSettings
    }
};