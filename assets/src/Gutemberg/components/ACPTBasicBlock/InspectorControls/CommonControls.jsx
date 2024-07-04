import React from "react";

const CommonControls = ({fields, attributes, setAttributes}) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        SelectControl,
    } = wp.components;

    const field = attributes.field ? JSON.parse(attributes.field) : null;

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
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <PanelRow>
                <SelectControl
                    label={__("Field", "acpt")}
                    value={attributes.field}
                    options={fields}
                    onChange={(field) => setAttributes({ ...attributes, field: field })}
                />
            </PanelRow>
        </React.Fragment>
    );
};

export default CommonControls;