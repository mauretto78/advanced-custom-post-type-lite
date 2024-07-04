import React from "react";

const TextOrLinkControls = ({ attributes, setAttributes }) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        SelectControl,
    } = wp.components;

    return (
        <PanelRow>
            <SelectControl
                label={__("Display as", "acpt")}
                value={attributes.display}
                options={[
                    {label: __("text", "acpt"), value: __("text", "acpt")},
                    {label: __("link", "acpt"), value: __("link", "acpt")},
                ]}
                onChange={ ( display ) => {
                    setAttributes({
                        ...attributes,
                        display: display
                    });
                } }
            />
        </PanelRow>
    );
};

export default TextOrLinkControls;