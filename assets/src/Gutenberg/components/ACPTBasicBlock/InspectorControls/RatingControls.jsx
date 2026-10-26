import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";

const RatingControls = ({attributes, setAttributes}) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        ColorPicker,
        SelectControl,
    } = wp.components;

    return (
        <React.Fragment>
            <PanelRow>
                <SelectControl
                    label={__("Display as", "acpt")}
                    value={attributes.display}
                    options={[
                        {label: __("Star icons", "acpt"), value: "star"},
                        {label: __("Text", "acpt"), value: "text"},
                    ]}
                    onChange={ ( display ) => {
                        setAttributes({
                            ...attributes,
                            display: display
                        });
                    } }
                />
            </PanelRow>
            <PanelRow>
                <ColorPicker
                    label={__("Color", "acpt")}
                    color={ attributes.color}
                    enableAlpha
                    defaultValue="#000"
                    onChange={ ( color ) => {
                        setAttributes({
                            ...attributes,
                            color: color
                        });
                    } }
                />
            </PanelRow>
        </React.Fragment>
    );
};

RatingControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default RatingControls;