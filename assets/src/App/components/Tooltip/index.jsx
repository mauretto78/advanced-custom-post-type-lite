import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {Tooltip as ReactTooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import {randomAlphabeticString} from "../../utils/strings";
import ReactDOMServer from 'react-dom/server';

const Tooltip = ({label, tip, icon = true}) => {

    const id = "tooltip_" + randomAlphabeticString();

    return (
        <span className="acpt-tooltip">
            <span
                className="i-flex-center s-8 cursor-help"
                data-tooltip-id={id}
                data-tooltip-html={ReactDOMServer.renderToStaticMarkup(tip)}
                data-tooltip-place="top"
            >
                <div className="acpt-tooltip-label">
                    {label}
                </div>
                {icon && (
                    <div className="acpt-tooltip-help top-2">
                        <Icon icon="bx:help-circle" color="#007CBA" width="18px" />
                    </div>
                )}
            </span>
            <ReactTooltip
                id={id}
                style={{
                    backgroundColor: "#777",
                    color: "#fff",
                }}
            />
        </span>
    );
};

Tooltip.propTypes = {
    label: PropTypes.string.isRequired,
    tip: PropTypes.element.isRequired,
    icon: PropTypes.bool,
};

export default Tooltip;