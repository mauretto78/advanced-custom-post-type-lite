import React from "react";
import {useNode} from "@craftjs/core";
import {useSelector} from "react-redux";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {ADDRESS, COLOR, DATE, GALLERY, IMAGE, TOGGLE, URL, VIDEO} from "../../../../../constants/fields";
import Measure from "../../SettingsPanel/Form/Measure";
import TargetLink from "../../SettingsPanel/Form/TargetLink";

export const ACPTMetaField = ({postId, box, field, type, width, height, target, dateFormat, elements}) => {

    const { actions: {setProp} } = useNode();

    // manage global state
    const {fetched:postData} = useSelector(state => state.fetchPostDataReducer);

    // manage local state
    setProp(props => props.type = type);

    return (
        <KeyboardInteractiveElement display="inline-block">
            <div className="element-container">
                <span className="title">[ACPT Meta field]</span>
                <div className="shortcode">
                    {`[acpt pid="${postData ? postData.ID : postId}" box="${box}" field="${field}" ${width ? 'width="'+width+'"' : ''} ${height ? 'height="'+height+'"' : ''} ${target ? 'target="'+target+'"' : ''} ${elements ? 'elements="'+elements+'"' : ''} ${dateFormat ? 'date-format="'+dateFormat+'"' : ''}]`}
                </div>
            </div>
        </KeyboardInteractiveElement>
    )
};

const ACPTMetaFieldSettings = () => {
    const { actions: {setProp}, type, width, height, target, dateFormat, elements } = useNode((node) => ({
        type: node.data.props.type,
        width: node.data.props.width,
        height: node.data.props.height,
        target: node.data.props.target,
        dateFormat: node.data.props.dateFormat,
        elements: node.data.props.elements,
    }));

    const group1 = [ADDRESS, IMAGE, VIDEO, COLOR, TOGGLE];
    const group2 = [URL];
    const group3 = [DATE];
    const group4 = [GALLERY];

    return (
        <div className="acpt-html-builder-additional-settings">
            { (group1.includes(type)) ?
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
                :
                null
            }
            { (group2.includes(type)) ?
                <div className="acpt-form-group">
                    <label>Select target</label>
                    <TargetLink
                        value={target}
                        onChange={(value) => {
                            setProp(props => {
                                props.target = value;
                                props.dateFormat = null;
                                props.width = null;
                                props.height = null;
                                props.elements = null;
                            });
                        }}
                    />
                </div>
                : null
            }
            { (group3.includes(type))
                ?
                <div className="acpt-form-group">
                    <label>Date format</label>
                    <select
                        className="acpt-form-control"
                        defaultValue={dateFormat}
                        onChange={(e) => {
                            const dateFormatValue = e.currentTarget.value;
                            setProp(props => {
                                props.dateFormat = dateFormatValue;
                                props.width = null;
                                props.height = null;
                                props.target = null;
                                props.elements = null;
                            });
                        }}
                    >
                        <option value={null}>--Select---</option>
                        <option value="d-M-y">dd-mmm-yy (ex. 28-OCT-90)</option>
                        <option value="d-M-Y">dd-mmm-yyyy (ex. 28-OCT-1990)</option>
                        <option value="d M y">mmm yy (ex. 28 OCT 90)</option>
                        <option value="d M Y">mmm yyyy (ex. 28 OCT 1990)</option>
                        <option value="d/m/Y">dd/mm/yy (ex. 28/10/90)</option>
                        <option value="d/m/Y">dd/mm/yyyy (ex. 28/10/1990)</option>
                        <option value="m/d/y">mm/dd/yy (ex. 10/28/90)</option>
                        <option value="m/d/Y">mm/dd/yyyy (ex. 10/28/1990)</option>
                        <option value="d.m.Y">dd.mm.yy (ex. 28.10.90)</option>
                        <option value="d.m.Y">dd.mm.yyyy (ex. 28.10.1990)</option>
                    </select>
                </div>
                :
                null
            }
            { (group4.includes(type)) ?
                <React.Fragment>
                    <div className="acpt-form-group">
                        <label>Number of elements</label>
                        <select
                            className="acpt-form-control"
                            defaultValue={elements}
                            onChange={(e) => {
                                const elementsValue = e.currentTarget.value;

                                setProp(props => {
                                    props.elements = elementsValue;
                                    props.width = null;
                                    props.height = null;
                                    props.target = null;
                                    props.dateFormat = null;
                                });
                            }}
                        >
                            <option value={null}>--Select---</option>
                            <option value="1">One element</option>
                            <option value="2">Two elements</option>
                            <option value="3">Three elements</option>
                            <option value="4">Four elements</option>
                            <option value="6">Six elements</option>
                        </select>
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
                </React.Fragment>




                : null
            }
        </div>
    )
};

ACPTMetaField.craft = {
    displayName: "ACPT Meta field",
    related: {
        settings: ACPTMetaFieldSettings
    },
};
