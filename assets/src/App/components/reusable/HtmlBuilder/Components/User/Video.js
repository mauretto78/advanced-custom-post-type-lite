import React from "react";
import {useNode} from "@craftjs/core";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import {squaresToString} from "../../../../../utils/strings";
import {Icon} from "@iconify/react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import Measure from "../../SettingsPanel/Form/Measure";

export const Video = ({url, borderRadius, width, height, margin, css}) => {

    return (
        <KeyboardInteractiveElement display="inline-block">
            {url ?
                <video
                    key={url}
                    className={css}
                    style={{
                        width: (width) ? width : null,
                        height: (height) ? height : null,
                        borderRadius: (typeof borderRadius !== 'undefined') ? squaresToString(borderRadius) : null,
                        margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                    }}
                    width={width}
                    height={height}
                    controls
                >
                    <source src={url} type="video/mp4"/>
                </video>
                :
                <div className="img-placeholder">
                    <Icon icon="bx:bx-video" width="48px" color="#7e9ebd" />
                </div>
            }
        </KeyboardInteractiveElement>
    );
};

const VideoSettings = () => {
    const { actions: {setProp}, url, borderRadius, width, height, margin, css } = useNode((node) => ({
        url: node.data.props.url,
        borderRadius: node.data.props.borderRadius,
        width: node.data.props.width,
        height: node.data.props.height,
        margin: node.data.props.margin,
        css: node.data.props.css,
    }));

    const uploadVideo = (e) => {
        const video = wp.media( {
            title: 'Upload Video',
            library: {
                type: [ 'video' ]
            },
            multiple: false
        } ).open()
            .on( 'select', function ( e ) {
                const uploaded_video = video.state().get( 'selection' ).first();
                const video_url = uploaded_video.toJSON().url;
                const video_name = uploaded_video.toJSON().name;

                setProp(props => {
                    props.url = video_url;
                });
            } );
    };

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Url of video</label>
                <div className="space-between">
                    <input
                        type="text"
                        readOnly={true}
                        className="acpt-form-control mr-1"
                        defaultValue={url}
                    />
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            uploadVideo(e);
                        }}
                        className="acpt-btn acpt-btn-primary-o"
                        href="#">
                        Upload Video
                    </a>
                </div>
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

Video.craft = {
    props: {
        width: "100%",
        height: null,
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    related: {
        settings: VideoSettings
    }
};