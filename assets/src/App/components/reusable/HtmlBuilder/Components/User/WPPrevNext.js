import React from "react";
import {useNode} from "@craftjs/core";
import {useSelector} from "react-redux";
import ColorPicker from "../../SettingsPanel/Form/ColorPicker";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {generatePadding, squaresToString} from "../../../../../utils/strings";

export const WPPrevNext = ({color, borderColor, borderThickness, borderRadius, margin, padding, css}) => {

    const {fetched:postData, loading: postDataLoading} = useSelector(state => state.fetchPostDataReducer);

    const renderStyle = () => {
        return {
            borderStyle: (borderThickness) ? "solid" : "hidden",
            borderRadius: (typeof borderRadius !== 'undefined') ? squaresToString(borderRadius) : null,
            borderColor: `${borderColor}`,
            borderWidth: borderThickness ? borderThickness+'px' : "hidden",
            margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
            padding: generatePadding(padding),
            color: (typeof color !== 'undefined') ? `${color}` : null,
        };
    };

    return (
        <KeyboardInteractiveElement>
            <div className="space-between">
                {postData.links.prev && (
                    <div className={css} style={renderStyle()}>
                        <a href="#" onClick={e => e.preventDefault()} style={{ color: (typeof color !== 'undefined') ? `${color}` : null }}>
                            &lt; {postData.links.prev.title}
                        </a>
                    </div>
                )}
                {postData.links.next && (
                    <div className={css} style={renderStyle()}>
                        <a href="#" onClick={e => e.preventDefault()} style={{ color: (typeof color !== 'undefined') ? `${color}` : null }}>
                            {postData.links.next.title} &gt;
                        </a>
                    </div>
                )}
            </div>
        </KeyboardInteractiveElement>
    );
};

const WPPrevNextSettings = () => {
    const { actions: {setProp}, color, borderColor, borderThickness, borderRadius, margin, padding, css } = useNode((node) => ({
        color: node.data.props.color,
        borderThickness: node.data.props.borderThickness,
        borderColor: node.data.props.borderColor,
        borderRadius: node.data.props.borderRadius,
        margin: node.data.props.margin,
        padding: node.data.props.padding,
        css: node.data.props.css
    }));

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Color</label>
                <ColorPicker
                    value={color ? color : ''}
                    onChange={(color) => setProp(props => props.color = color) }
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

WPPrevNext.craft = {
    displayName: '[wp-prev-next links]',
    related: {
        settings: WPPrevNextSettings
    }
};