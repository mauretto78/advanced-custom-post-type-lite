import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";

const AddressControls = ({ attributes, setAttributes }) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        RangeControl,
        TextControl,
        SelectControl,
    } = wp.components;

    return (
        <React.Fragment>
            <PanelRow>
                <SelectControl
                    label={__("Display as", "acpt")}
                    value={attributes.display}
                    options={[
                        {label: __("text", "acpt"), value: "text"},
                        {label: __("map", "acpt"), value: "map"},
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
                <RangeControl
                    label={__("Map zoom", "acpt")}
                    value={Number(attributes.zoom ?? 14)}
                    min={ 1 }
                    max={ 22 }
                    onChange={ ( zoom ) => {
                        setAttributes({
                            ...attributes,
                            zoom: zoom
                        });
                    } }
                />
            </PanelRow>
            <PanelRow>
                <TextControl
                    label={__("Width", "acpt")}
                    value={attributes.width}
                    onChange={ ( width ) => {
                        setAttributes({
                            ...attributes,
                            width: width
                        });
                    } }
                />
            </PanelRow>
            <PanelRow>
                <TextControl
                    label={__("Height", "acpt")}
                    value={attributes.height}
                    onChange={ ( height ) => {
                        setAttributes({
                            ...attributes,
                            height: height
                        });
                    } }
                />
            </PanelRow>
        </React.Fragment>
    );
};

AddressControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default AddressControls;