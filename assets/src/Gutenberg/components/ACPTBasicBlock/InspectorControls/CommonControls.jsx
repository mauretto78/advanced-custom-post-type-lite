import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";
import {isJsonString} from "../../../utils/json";

const CommonControls = ({fields, attributes, setAttributes}) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        TextControl,
        SelectControl,
    } = wp.components;

    const field = isJsonString(attributes.field) ? JSON.parse(attributes.field) : null;

    const prefixAndSuffixControls = (
        <React.Fragment>
            <PanelRow>
                <TextControl
                    label={__("Prefix", "acpt")}
                    value={attributes.prefix}
                    onChange={ ( prefix ) => {
                        setAttributes({
                            ...attributes,
                            prefix: prefix
                        });
                    } }
                />
            </PanelRow>
            <PanelRow>
                <TextControl
                    label={__("Suffix", "acpt")}
                    value={attributes.suffix}
                    onChange={ ( suffix ) => {
                        setAttributes({
                            ...attributes,
                            suffix: suffix
                        });
                    } }
                />
            </PanelRow>
        </React.Fragment>
    );

    if(field && field.block_name){
        return (
            <React.Fragment>
                <PanelRow>
                    <div className="acpt-inline-block">
                        <span className="acpt-badge acpt-badge-primary">{field.parent_field}</span>
                        <span className="acpt-badge acpt-badge-success">{field.block_name}</span>
                        <span className="acpt-badge acpt-badge-success-outline">{field.block_index}</span>
                        <span className="acpt-badge acpt-badge-secondary-outline">{field.field}</span>
                        <span className="acpt-badge acpt-badge-secondary-outline">{field.index}</span>
                    </div>
                </PanelRow>
                {prefixAndSuffixControls}
            </React.Fragment>
        );
    }

    if(field && field.parent_field){
        return (
            <React.Fragment>
                <PanelRow>
                    <div className="acpt-inline-block">
                        <span className="acpt-badge acpt-badge-primary">{field.parent_field}</span>
                        <span className="acpt-badge acpt-badge-secondary-outline">{field.field}</span>
                        <span className="acpt-badge acpt-badge-secondary-outline">{field.index}</span>
                    </div>
                </PanelRow>
                {prefixAndSuffixControls}
            </React.Fragment>
        );
    }

    if(field){
        return (
            <React.Fragment>
                <PanelRow>
                    <div className="acpt-inline-block">
                        <span className="acpt-badge acpt-badge-secondary-outline">
                            {field.label}
                        </span>
                    </div>
                </PanelRow>
                {prefixAndSuffixControls}
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <PanelRow>
                <SelectControl
                    label={__("Field", "acpt")}
                    value={attributes.field ?? ""}
                    options={fields}
                    onChange={(field) => setAttributes({ ...attributes, field: field })}
                />
            </PanelRow>
        </React.Fragment>
    );
};

CommonControls.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
        group: PropTypes.string,
    })).isRequired,
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default CommonControls;