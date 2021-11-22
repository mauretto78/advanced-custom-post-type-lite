import React from "react";
import {useNode} from "@craftjs/core";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import InputRange from "../../SettingsPanel/Form/InputRange";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {squaresToString} from "../../../../../utils/strings";
import Measure from "../../SettingsPanel/Form/Measure";

export const Map = ({address, width, height, margin, zoom}) => {

    return (
        <KeyboardInteractiveElement>
            <iframe
                style={{
                    margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                    width: (typeof width !== 'undefined') ? width : null,
                    height: (typeof height !== 'undefined') ? height : null,
                }}
                width={width}
                height={height}
                src={`https://maps.google.com/maps?q=${address}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`}
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
            />
        </KeyboardInteractiveElement>
    );
};

const MapSettings = () => {
    const { actions: {setProp}, address, zoom, margin, width, height } = useNode((node) => ({
        address: node.data.props.address,
        zoom: node.data.props.zoom,
        margin: node.data.props.margin,
        width: node.data.props.width,
        height: node.data.props.height,
    }));

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Address</label>
                <input
                    type="text"
                    className="acpt-form-control"
                    defaultValue={address}
                    onChange={(e) => {
                        const addressValue = e.currentTarget.value;
                        setProp(props => props.address = addressValue);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Zoom</label>
                <InputRange
                    min={1}
                    max={17}
                    value={zoom}
                    onChange={(value) => {
                        setProp(props => props.zoom = value);
                    }}
                />
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
                <label>Margins</label>
                <FourSquarePixel
                    value={margin}
                    defaultLocked={false}
                    onChange={(values) => {
                        setProp(props => props.margin = values);
                    }}
                />
            </div>
        </div>
    )
};

Map.craft = {
    props: {
        address: 'Trafalgar Square, London WC2N 5DN',
        width: "100%",
        height: "500px",
        zoom: 9,
        margin: [0,0,20,0, 'px']
    },
    related: {
        settings: MapSettings
    }
};