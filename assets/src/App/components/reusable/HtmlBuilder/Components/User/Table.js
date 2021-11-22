import React from "react";
import {useNode} from "@craftjs/core";
import ContentEditable from 'react-contenteditable'
import ColorPicker from "../../SettingsPanel/Form/ColorPicker";
import Select from "react-select";
import {filterByValue} from "../../../../../utils/objects";
import {reactSelectStyles} from "../../../../../constants/styles";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import {Icon} from "@iconify/react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {squaresToString} from "../../../../../utils/strings";

export const Table = ({text, rows, columns, border, borderThickness, borderColor, withHeading, width, margin, css}) => {

    const { actions: {setProp} } = useNode();

    const renderRows = () => {
        let rowsToRender = [];

        if(withHeading === true || withHeading === 'true'){
            let headingsToRender = [];
            for (let h=0; h<columns; h++ ){

                if (text.heading && typeof text.heading[h] === 'undefined') {
                    setProp(props => {
                        props.text.heading[h] =  'Heading';
                    })
                };

                headingsToRender.push(
                    <th
                        style={{
                            padding: "5px",
                            border: (border === 'border-all' || border === 'border-inner') ? borderThickness+"px solid " + borderColor : null,
                        }}
                    >
                        <ContentEditable
                            disabled={false}
                            html={(text.heading && typeof text.heading[h] !== 'undefined') ? text.heading[h] : 'Heading'}
                            onChange={e =>
                                setProp(props => {
                                    props.text.heading[h] = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")
                                })
                            }
                            tagName='span'
                        />
                    </th>
                );
            }

            rowsToRender.push(<tr>{headingsToRender.map((headingToRender) => headingToRender)}</tr>);
        }

        for (let i=0; i<rows; i++ ){
            let columnsToRender = [];
            for (let k=0; k<columns; k++ ){

                if (text.body && typeof text.body[i][k] === 'undefined') {
                    setProp(props => {
                        props.text.body[i][k] =  'Your text';
                    })
                };

                columnsToRender.push(
                    <td
                        style={{
                            padding: "5px",
                            border: (border === 'border-all' || border === 'border-inner') ? borderThickness+"px solid " + borderColor : null,
                        }}
                    >
                        <ContentEditable
                            disabled={false}
                            html={( text.body && typeof text.body[i] !== 'undefined' && typeof text.body[i][k] !== 'undefined' ) ? text.body[i][k] : 'Your text'}
                            onChange={e =>
                                setProp(props => {
                                    props.text.body[i][k] = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")
                                })
                            }
                            tagName='span'
                        />
                    </td>
                );
            }

            rowsToRender.push(<tr>{columnsToRender.map((columnsToRender) => columnsToRender)}</tr>);
        }

        return rowsToRender;
    };

    return (
        <KeyboardInteractiveElement>
            <table
                className={css}
                style={{
                    borderCollapse: "collapse",
                    borderStyle: (border === 'border-all' || border === 'border-outer') ? "solid" : "hidden",
                    borderColor: (border === 'border-all' || border === 'border-outer') ? borderColor  : null,
                    borderWidth: borderThickness ? borderThickness : "hidden",
                    margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                    width: width,
                }}
            >
                {renderRows().map((rowToRender)=> rowToRender)}
            </table>
        </KeyboardInteractiveElement>
    );
};

const TableSettings = () => {
    const { actions: {setProp}, text, rows, columns, border, borderThickness, borderColor, withHeading, width, margin, css } = useNode((node) => ({
        text: node.data.props.text,
        rows: node.data.props.rows,
        columns: node.data.props.columns,
        border: node.data.props.border,
        borderThickness: node.data.props.borderThickness,
        borderColor: node.data.props.borderColor,
        withHeading: node.data.props.withHeading,
        width: node.data.props.width,
        margin: node.data.props.margin,
        css: node.data.props.css,
    }));

    const borderOptions = [
        {label: <div className="vertical-center"><Icon icon="bx:bx-border-all" color="#aaa" width="24px" />&nbsp;Border all</div>, value: "border-all"},
        {label: <div className="vertical-center"><Icon icon="bx:bx-border-outer" color="#aaa" width="24px" />&nbsp;Border outer</div>, value: "border-outer"},
        {label: <div className="vertical-center"><Icon icon="bx:bx-border-inner" color="#aaa" width="24px" />&nbsp;Border inner</div>, value: "border-inner"},
        {label: <div className="vertical-center"><Icon icon="bx:bx-border-none" color="#aaa" width="24px" />&nbsp;Border none</div>, value: "border-none"},
    ];

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Width</label>
                <input
                    type="text"
                    className="acpt-form-control"
                    defaultValue={width}
                    onChange={(e) => {
                        const widthValue = e.currentTarget.value;
                        setProp(props => props.width = widthValue);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Heading</label>
                <select
                    className="acpt-form-control"
                    defaultValue={withHeading}
                    onChange={(e) => {
                        const withHeadingValue = e.currentTarget.value;
                        setProp(props => props.withHeading = withHeadingValue);
                    }}
                >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
            </div>
            <div className="space-between">
                <div className="acpt-form-group pr-1">
                    <label>Number of columns</label>
                    <input
                        type="number"
                        min={0}
                        step={1}
                        className="acpt-form-control"
                        defaultValue={columns}
                        onChange={(e) => {
                            const columnsValue = e.currentTarget.value;
                            setProp(props => {
                                props.columns = columnsValue;
                            });
                        }}
                    />
                </div>
                <div className="acpt-form-group pl-1">
                    <label>Number of rows</label>
                    <input
                        type="number"
                        min={0}
                        step={1}
                        className="acpt-form-control"
                        defaultValue={rows}
                        onChange={(e) => {

                            // fill empty rows with placeholders
                            setProp(props => {

                                const value = e.currentTarget.value;
                                let r = props.text;

                                for (let i=0; i<value; i++ ){

                                    if(typeof r.body[i] === 'undefined'){

                                        let placeholders = [];
                                        for (let k=0; k<props.columns; k++ ){
                                            placeholders.push("Your text");
                                        }

                                        r.body.push(placeholders);
                                    }
                                }

                                props.text = r;
                                props.rows = value;
                            });
                        }}
                    />
                </div>
            </div>
            <div className="space-between">
                <div className="acpt-form-group pr-1">
                    <label>Border</label>
                    <Select
                        defaultValue={filterByValue(borderOptions, border)}
                        onChange={(obj) => setProp(props => props.border = obj.value) }
                        placeholder="Select border type from list"
                        styles={reactSelectStyles}
                        options={borderOptions}
                    />
                </div>
                <div className="acpt-form-group pl-1">
                    <label>Border thickness</label>
                    <input
                        type="number"
                        min={0}
                        step={1}
                        className="acpt-form-control"
                        defaultValue={borderThickness}
                        onChange={(e) => {
                            const borderThicknessValue = e.currentTarget.value;
                            setProp(props => props.borderThickness = borderThicknessValue);
                        }}
                    />
                </div>
            </div>
            <div className="acpt-form-group">
                <label>Border color</label>
                <ColorPicker
                    value={borderColor ? borderColor : ''}
                    onChange={(color) => setProp(props => props.borderColor = color) }
                />
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

Table.craft = {
    props: {
        width: "100%",
        borderThickness: 2,
        borderColor: '#444',
        withHeading: true,
        border: "border-all",
        margin: [0,0,20,0, 'px'],
        text: {
            heading: ['Heading','Heading'],
            body: [
                ['Your text','Your text'],
                ['Your text','Your text'],
            ],
        }
    },
    related: {
        settings: TableSettings
    }
};