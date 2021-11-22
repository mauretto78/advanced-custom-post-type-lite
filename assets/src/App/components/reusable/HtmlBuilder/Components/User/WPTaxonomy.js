import React from "react";
import {useNode} from "@craftjs/core";
import {useSelector} from "react-redux";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import Measure from "../../SettingsPanel/Form/Measure";
import {squaresToString} from "../../../../../utils/strings";
import {Icon} from "@iconify/react";

export const WPTaxonomy = ({fontSize, delimiter, margin, padding, css}) => {

    const {fetched:postData, loading: postDataLoading} = useSelector(state => state.fetchPostDataReducer);

    return (
        <KeyboardInteractiveElement display="inline-block">
            {postData.taxonomies.length > 0
                ?
                <div className={css}
                     style={{
                         margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                         padding: (typeof padding !== 'undefined') ? squaresToString(padding) : null,
                         fontSize: `${fontSize !== null && typeof fontSize !== 'undefined' ? fontSize : "14px"}`,
                     }}
                >
                    {postData.taxonomies.map((taxonomy, index) => {
                        return (
                            <React.Fragment>
                                <a href="#" onClick={e => e.preventDefault()}>{taxonomy.name}</a>{delimiter && index !== (postData.taxonomies.length-1) ? delimiter : null}
                            </React.Fragment>
                        );
                    })}
                </div>
                :
                <span className="inline-flex-center" style={{ color: '#777' }}>
                    <Icon icon="ant-design:warning-outlined"/>
                    &nbsp;
                    No taxonomies for this post
                </span>
            }
        </KeyboardInteractiveElement>
    );
};

const WPTaxonomySettings = () => {
    const { actions: {setProp}, fontSize, margin, padding, delimiter, css } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        margin: node.data.props.margin,
        padding: node.data.props.padding,
        delimiter: node.data.props.delimiter,
        css: node.data.props.css,
    }));

    return (
        <div className="acpt-html-builder-additional-settings">
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

WPTaxonomy.craft = {
    displayName: '[wp-taxonomy]',
    related: {
        settings: WPTaxonomySettings
    }
};