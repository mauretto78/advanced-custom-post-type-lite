import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";
import {colors} from "../../../data/colors";

const LinkControls = ({ attributes, setAttributes }) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        BaseControl,
        ColorPicker,
        GradientPicker,
        SelectControl,
        __experimentalBorderControl: BorderControl,
        __experimentalBoxControl: BoxControl
    } = wp.components;

    const options = [
        {label: __("--Select---", "acpt"), value: ""},
        {label: __("Opens in a new window or tab", "acpt"), value: "_blank"},
        {label: __("Opens in the same frame as it was clicked", "acpt"), value: "_self"},
        {label: __("Opens in the parent frame", "acpt"), value: "_parent"},
        {label: __("Opens in the full body of the window", "acpt"), value: "_top"},
    ];

    return (
        <React.Fragment>
            <PanelRow>
                <SelectControl
                    label={__("Select target", "acpt")}
                    value={attributes.target}
                    options = {options}
                    onChange={ ( target ) => {
                        setAttributes({
                            ...attributes,
                            target: target
                        });
                    } }
                />
            </PanelRow>
            <PanelRow>
                <BoxControl
                    label={ __( 'Padding' ) }
                    onChange={ ( padding ) => {
                        setAttributes({
                            ...attributes,
                            padding: padding
                        });
                    } }
                    values={ attributes.padding }
                />
            </PanelRow>
            <PanelRow>
                <BaseControl
                    label={
                        <div style={
                            {
                                display: "flex",
                                justifyContent: "space-between",
                                width: "216px"
                            }
                        }>
                            <span>
                                {__( 'Text color' )}
                            </span>
                            <button
                                type="button"
                                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}
                                onClick={e => {
                                    e.preventDefault();
                                    setAttributes({
                                        ...attributes,
                                        textColor: null
                                    });
                                }}
                            >
                                {__( 'Reset' )}
                            </button>
                        </div>
                    }
                >
                    <ColorPicker
                        onChange={ ( textColor ) => {
                            setAttributes({
                                ...attributes,
                                textColor: textColor
                            });
                        } }
                        enableAlpha
                        defaultValue="#000"
                        color={ attributes.textColor }
                    />
                </BaseControl>
            </PanelRow>
            <PanelRow>
                <BaseControl
                    label={
                        <div style={
                            {
                                display: "flex",
                                justifyContent: "space-between",
                                width: "216px"
                            }
                        }>
                            <span>
                                {__( 'Background color' )}
                            </span>
                            <button
                                type="button"
                                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}
                                onClick={e => {
                                    e.preventDefault();
                                    setAttributes({
                                        ...attributes,
                                        backgroundColor: null
                                    });
                                }}
                            >
                                {__( 'Reset' )}
                            </button>
                        </div>
                    }
                >
                    <ColorPicker
                        onChange={ ( backgroundColor ) => {
                            setAttributes({
                                ...attributes,
                                backgroundColor: backgroundColor
                            });
                        } }
                        enableAlpha
                        defaultValue="#000"
                        color={ attributes.backgroundColor }
                    />
                </BaseControl>
            </PanelRow>
            <PanelRow>
                <BaseControl
                    label={ __( 'Gradient' ) }
                >
                    <GradientPicker
                        onChange={ ( gradient ) => {
                            setAttributes({
                                ...attributes,
                                gradient: gradient
                            });
                        } }
                        value={ attributes.gradient }
                        gradients={ [
                            {
                                name: 'JShine',
                                gradient:
                                    'linear-gradient(135deg,#12c2e9 0%,#c471ed 50%,#f64f59 100%)',
                                slug: 'jshine',
                            },
                            {
                                name: 'Moonlit Asteroid',
                                gradient:
                                    'linear-gradient(135deg,#0F2027 0%, #203A43 0%, #2c5364 100%)',
                                slug: 'moonlit-asteroid',
                            },
                            {
                                name: 'Rastafarie',
                                gradient:
                                    'linear-gradient(135deg,#1E9600 0%, #FFF200 0%, #FF0000 100%)',
                                slug: 'rastafari',
                            },
                        ] }
                    />
                </BaseControl>
            </PanelRow>
            <PanelRow>
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
            </PanelRow>
            <PanelRow>
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
            </PanelRow>
        </React.Fragment>
    );
};

LinkControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default LinkControls;