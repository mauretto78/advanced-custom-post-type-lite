import React from "react";
import {useNode} from "@craftjs/core";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import {Icon} from "@iconify/react";
import {squaresToString} from "../../../../../utils/strings";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import Measure from "../../SettingsPanel/Form/Measure";

export const Image = ({url, alt, borderRadius, width, height, margin, css}) => {

    return (
        <KeyboardInteractiveElement display="inline-block" width={width} height={height}>
            {url ?
                <img
                    className={css}
                    style={{
                        objectFit: 'cover',
                        width: "100%",
                        height: (typeof height !== 'undefined') ? height : null,
                        borderRadius: (typeof borderRadius !== 'undefined') ? squaresToString(borderRadius) : null,
                        margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                    }}
                    src={url}
                    alt={alt}
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

const ImageSettings = () => {
    const { actions: {setProp}, url, alt, borderRadius, width, height, margin, css } = useNode((node) => ({
        url: node.data.props.url,
        alt: node.data.props.alt,
        borderRadius: node.data.props.borderRadius,
        width: node.data.props.width,
        height: node.data.props.height,
        margin: node.data.props.margin,
        css: node.data.props.css,
    }));

    const uploadImage = (e) => {
        const image = wp.media( {
            title: 'Upload Image',
            library: {
                type: [ 'image' ]
            },
            multiple: false
        } ).open()
            .on( 'select', function ( e ) {
                const uploaded_image = image.state().get( 'selection' ).first();
                const image_url = uploaded_image.toJSON().url;
                const image_name = uploaded_image.toJSON().name;

                setProp(props => {
                    props.url = image_url;
                    props.alt = image_name;
                });
            } );
    };

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Url of image</label>
                <div className="space-between">
                    <input
                        type="text"
                        readOnly={true}
                        className="acpt-form-control mr-1"
                        value={url ? url : ''}
                    />
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            uploadImage(e);
                        }}
                        className="acpt-btn acpt-btn-primary-o mr-1"
                        href="#">
                        Upload
                    </a>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            setProp(props => {
                                props.url = null;
                                props.alt = null;
                            });
                        }}
                        className="acpt-btn acpt-btn-danger"
                        href="#">
                        Delete
                    </a>
                </div>
            </div>
            <div className="acpt-form-group">
                <label>Description (alt tag)</label>
                <input
                    type="text"
                    className="acpt-form-control"
                    defaultValue={alt}
                    onChange={(e) => {
                        const descValue = e.currentTarget.value;
                        setProp(props => props.alt = descValue);
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

Image.craft = {
    props: {
        width: "100%",
        height: null
    },
    related: {
        settings: ImageSettings
    }
};