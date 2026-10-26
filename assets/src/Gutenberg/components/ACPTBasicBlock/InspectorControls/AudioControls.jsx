import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";

const AudioControls = ({ attributes, setAttributes }) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        SelectControl,
    } = wp.components;

    return (
        <React.Fragment>
            <PanelRow>
                <SelectControl
                    label={__("Style", "acpt")}
                    value={attributes.audioStyle}
                    options={[
                        {label: __("light", "acpt"), value: "light"},
                        {label: __("dark", "acpt"), value: "dark"},
                    ]}
                    onChange={ ( audioStyle ) => {
                        setAttributes({
                            ...attributes,
                            audioStyle: audioStyle
                        });
                    } }
                />
            </PanelRow>
        </React.Fragment>
    );
};

AudioControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default AudioControls;