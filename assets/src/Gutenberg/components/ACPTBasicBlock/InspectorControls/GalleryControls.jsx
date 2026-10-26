import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";
import {colors} from "../../../data/colors";

const GalleryControls = ({attributes, setAttributes}) => {

    const { __ } = wp.i18n;
    const {
        ToggleControl,
        RangeControl,
        SelectControl,
        __experimentalInputControl: InputControl,
        __experimentalBorderControl: BorderControl,
        __experimentalBoxControl: BoxControl
    } = wp.components;

    const controlStyle = {
        width: '100%',
        marginBottom: '16px',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 0' }}>
            <div style={controlStyle}>
                <SelectControl
                    label={__("Display as", "acpt")}
                    value={attributes.display}
                    options={[
                        {label: __("Mosaic", "acpt"), value: "mosaic"},
                        {label: __("Masonry", "acpt"), value: "masonry"},
                        {label: __("Carousel", "acpt"), value: "carousel"},
                    ]}
                    onChange={ ( display ) => {
                        setAttributes({
                            ...attributes,
                            display: display
                        });
                    } }
                />
            </div>
            {attributes.display === "carousel" && (
                <div style={controlStyle}>
                    <RangeControl
                        label={__("Carousel speed", "acpt")}
                        value={Number(attributes.carouselSpeed ?? 5000)}
                        min={ 1000 }
                        max={ 10000 }
                        onChange={ ( carouselSpeed ) => {
                            setAttributes({
                                ...attributes,
                                carouselSpeed: carouselSpeed
                            });
                        }}
                    />
                </div>
            )}
            {attributes.display === "mosaic" && (
                <div style={controlStyle}>
                    <ToggleControl
                        label={__("Uniform image height", "acpt")}
                        onChange={ ( uniformHeight ) => {
                            setAttributes({
                                ...attributes,
                                uniformHeight: uniformHeight
                            });
                        }}
                        checked={attributes.uniformHeight ?? false}
                    />
                </div>
            )}
            {attributes.display === "mosaic" && attributes.uniformHeight && (
                <div style={controlStyle}>
                    <InputControl
                        type="number"
                        label={__("Mosaic image height", "acpt")}
                        value={attributes.customHeight !== null && typeof attributes.customHeight !== "undefined" ? attributes.customHeight : 250}
                        onChange={ ( customHeight ) => {
                            setAttributes({
                                ...attributes,
                                customHeight: typeof customHeight !== "undefined" ? Number(customHeight) : 250
                            });
                        }}
                    />
                </div>
            )}
            <div style={controlStyle}>
                <SelectControl
                    label={__("Sorting", "acpt")}
                    value={attributes.sort}
                    options={[
                        {label: __("Ascendant", "acpt"), value: "asc"},
                        {label: __("Descendant", "acpt"), value: "desc"},
                        {label: __("Random", "acpt"), value: "rand"},
                    ]}
                    onChange={ ( sort ) => {
                        setAttributes({
                            ...attributes,
                            sort: sort
                        });
                    } }
                />
            </div>
            <div style={controlStyle}>
                <ToggleControl
                    label={__("Lightbox", "acpt")}
                    help={attributes.lightbox ? __("Lightbox enabled", "acpt") : __("Lightbox disabled", "acpt")}
                    onChange={ ( lightbox ) => {
                        setAttributes({
                            ...attributes,
                            lightbox: lightbox
                        });
                    }}
                    checked={attributes.lightbox ?? false}
                />
            </div>
            <div style={controlStyle}>
                <BorderControl
                    colors={ colors }
                    label={ __( 'Border' ) }
                    onChange={ ( border ) => {
                        setAttributes({
                            ...attributes,
                            border: border
                        });
                    } }
                    value={ attributes.border }
                />
            </div>
            <div style={controlStyle}>
                <BoxControl
                    label={ __( 'Border radius' ) }
                    onChange={ ( borderRadius ) => {
                        setAttributes({
                            ...attributes,
                            borderRadius: borderRadius
                        });
                    } }
                    values={ attributes.borderRadius }
                />
            </div>
            <div style={controlStyle}>
                <RangeControl
                    label={__("Gap", "acpt")}
                    value={Number(attributes.gap ?? 20)}
                    min={ 0 }
                    max={ 60 }
                    onChange={ ( gap ) => {
                        setAttributes({
                            ...attributes,
                            gap: gap
                        });
                    } }
                />
            </div>
            <div style={controlStyle}>
                <RangeControl
                    label={__("Elements per row", "acpt")}
                    value={Number(attributes.elements ?? 3)}
                    min={ 1 }
                    max={ 6 }
                    onChange={ ( elements ) => {
                        setAttributes({
                            ...attributes,
                            elements: elements
                        });
                    } }
                />
            </div>
        </div>
    );
};

GalleryControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default GalleryControls;