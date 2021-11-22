import React from "react";
import {useNode} from "@craftjs/core";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import {useSelector} from "react-redux";
import {Icon} from "@iconify/react";
import {squaresToString} from "../../../../../utils/strings";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import Measure from "../../SettingsPanel/Form/Measure";

export const WPThumbnail = ({borderRadius, width, height, margin, css}) => {

    const {fetched:postData, loading: postDataLoading} = useSelector(state => state.fetchPostDataReducer);

    return (
        <KeyboardInteractiveElement display="inline-block" width={width} height={height}>
            {postData.thumbnail.url !== false
                ?
                <img
                    className={css}
                    style={{
                        objectFit: 'cover',
                        width: "100%",
                        height: (typeof height !== 'undefined') ? height : null,
                        borderRadius: (typeof borderRadius !== 'undefined') ? squaresToString(borderRadius) : null,
                        margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                    }}
                    src={postData.thumbnail.url}
                    alt={postData.description ? postData.description : postData.title}
                />
                :
                <div
                    className="img-placeholder"
                    style={{
                        width: (width) ? width : null,
                        height: (height) ? height : null,
                        borderRadius: (typeof borderRadius !== 'undefined') ? squaresToString(borderRadius) : null,
                        margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                    }}
                >
                    <Icon icon="bx:bx-image-alt" width="48px" color="#7e9ebd" />
                </div>
            }
        </KeyboardInteractiveElement>
    );
};

const WPThumbnailSettings = () => {
    const { actions: {setProp}, borderRadius, width, height, margin, css } = useNode((node) => ({
        borderRadius: node.data.props.borderRadius,
        width: node.data.props.width,
        height: node.data.props.height,
        margin: node.data.props.margin,
        css: node.data.props.css,
    }));

    return (
        <div className="acpt-html-builder-additional-settings">
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
                <label>Border radius</label>
                <FourSquarePixel
                    value={(typeof borderRadius !== 'undefined') ? borderRadius: null}
                    onChange={(values) => {
                        setProp(props => props.borderRadius = values);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Margins</label>
                <FourSquarePixel
                    value={(typeof margin !== 'undefined') ? margin: null}
                    defaultLocked={false}
                    onChange={(values) => {
                        setProp(props => props.margin = values);
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

WPThumbnail.craft = {
    displayName: '[wp-thumbnail]',
    props: {
        width: "100%",
        height: null
    },
    related: {
        settings: WPThumbnailSettings
    }
};