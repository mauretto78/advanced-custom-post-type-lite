import React, {useEffect, useRef} from "react";
import {useEditor, useNode} from "@craftjs/core";
import ColorPicker from "../../SettingsPanel/Form/ColorPicker";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import Measure from "../../SettingsPanel/Form/Measure";
import {Void} from "./Void";

export const Container = ({minHeight, maxWidth, background, padding, css, isDeletable, children}) => {

    const { connectors: {connect, drag} } = useNode();
    const { actions } = useEditor();
    const wrapperRef = useRef(null);

    // reset selection outside html builder
    const useOutsideClick = (ref) => {
        useEffect(() => {
            function handleClickOutside(event) {
                if (
                    ref.current &&
                    !ref.current.contains(event.target) &&
                    typeof event.target.className === 'string' &&
                    event.target.className.includes("acpt-html-builder")
                ) {
                    actions.selectNode(null);
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    };

    useOutsideClick(wrapperRef);

    return (
        <div ref={wrapperRef}>
            <div ref={ref=> connect(drag(ref))} className="element-container">
                <span className="title">Container</span>
                <div className="content">
                    {children ? children : <Void /> }
                </div>
            </div>
        </div>
    )
};

const ContainerSettings = () => {
    const { actions: {setProp}, minHeight, maxWidth, background, padding, css } = useNode((node) => ({
        minHeight: node.data.props.minHeight,
        maxWidth: node.data.props.maxWidth,
        background: node.data.props.background,
        padding: node.data.props.padding,
        css: node.data.props.css
    }));

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Max-width</label>
                <Measure
                    value={maxWidth}
                    onChange={(value) => {
                        setProp(props => props.maxWidth = value);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Min-height</label>
                <Measure
                    value={minHeight}
                    onChange={(value) => {
                        setProp(props => props.minHeight = value);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Background Color</label>
                <ColorPicker
                    value={background ? background : ''}
                    onChange={(color) => setProp(props => props.background = color) }
                />
            </div>
            <div className="acpt-form-group">
                <label>Padding</label>
                <FourSquarePixel
                    value={padding}
                    defaultLocked={false}
                    onChange={(values) => {
                        setProp(props => props.padding = values);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Additional CSS classes</label>
                <input
                    type="text"
                    className="acpt-form-control"
                    defaultValue={css}
                    onChange={(e) => {
                        const cssValue = e.currentTarget.value;
                        setProp(props => props.css = cssValue);
                    }}
                />
            </div>
        </div>
    )
};

Container.craft = {
    props: {
        css: ""
    },
    related: {
        settings: ContainerSettings
    }
};