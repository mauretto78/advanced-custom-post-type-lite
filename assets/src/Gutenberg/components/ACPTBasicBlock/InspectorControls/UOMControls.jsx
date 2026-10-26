import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";

const UOMControls = ({attributes, setAttributes}) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        TextControl,
        SelectControl,
    } = wp.components;

    const options = [
        {label: __("--Select---", "acpt"), value: ""},
        {value:"prepend", label: "Prepend"},
        {value:"append", label: "Append"},
        {value:"none", label: "None"},
    ];

    const uomFormatOptions = [
        {label: __("--Select---", "acpt"), value: ""},
        {value:"full", label: "Full"},
        {value:"abbreviation", label: "Abbreviation"},
    ];

    return (
        <React.Fragment>
            <PanelRow>
                <TextControl
                    label={__("Value format (Decimal points)", "acpt")}
                    value={attributes.uomFormatDecimalPoints}
                    onChange={ ( uomFormatDecimalPoints ) => {
                        setAttributes({
                            ...attributes,
                            uomFormatDecimalPoints: uomFormatDecimalPoints
                        });
                    } }
                />
            </PanelRow>
            <PanelRow>
                <TextControl
                    label={__("Value format (Decimal separator)", "acpt")}
                    value={attributes.uomFormatDecimalSeparator}
                    onChange={ ( uomFormatDecimalSeparator ) => {
                        setAttributes({
                            ...attributes,
                            uomFormatDecimalSeparator: uomFormatDecimalSeparator
                        });
                    } }
                />
            </PanelRow>
            <PanelRow>
                <TextControl
                    label={__("Value format (Thousands separator)", "acpt")}
                    value={attributes.uomFormatThousandsSeparator}
                    onChange={ ( uomFormatThousandsSeparator ) => {
                        setAttributes({
                            ...attributes,
                            uomFormatThousandsSeparator: uomFormatThousandsSeparator
                        });
                    } }
                />
            </PanelRow>
            <PanelRow>
                <SelectControl
                    label={__("UOM format", "acpt")}
                    value={attributes.uomFormat}
                    options={uomFormatOptions}
                    onChange={ ( uomFormat ) => {
                        setAttributes({
                            ...attributes,
                            uomFormat: uomFormat
                        });
                    } }
                />
            </PanelRow>
            <PanelRow>
                <SelectControl
                    label={__("UOM position", "acpt")}
                    value={attributes.uomPosition}
                    options={options}
                    onChange={ ( uomPosition ) => {
                        setAttributes({
                            ...attributes,
                            uomPosition: uomPosition
                        });
                    } }
                />
            </PanelRow>
        </React.Fragment>
    );
};

UOMControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default UOMControls;