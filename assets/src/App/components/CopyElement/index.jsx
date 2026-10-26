import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {copyToTheClipboard} from "../../utils/misc";
import {toast} from "react-hot-toast";
import useTranslation from "../../hooks/useTranslation";
import {randomAlphabeticString} from "../../utils/strings";
import {SharedTooltip} from "../Tooltip";

const CopyElement = ({text, size = 'default', testId}) => {

    const tooltipId = useRef(null);
    if (tooltipId.current === null) {
        tooltipId.current = "tooltip_" + randomAlphabeticString();
    }

    if(!text || typeof text !== 'string') return null;

    const iconSize = size === 'default' ? 18 : 14;
    const copyLabel = useTranslation("Copy to clipboard");
    const valueLabel = useTranslation("Value to copy");

    return (
        <div className={`acpt-copy-element ${size}`}>
            <input
                data-testid={testId ? "copy-element-"+testId : null}
                className={`form-control ${size}`}
                type="text"
                readOnly={true}
                aria-label={valueLabel}
                value={text}
            />
            <div className="divider" />
            {/* data-tooltip-* on the button itself, not a <Tooltip> wrapper:
                .copy-element-link is position:absolute against .acpt-copy-element,
                and .acpt-tooltip's own position:relative would re-anchor it. The
                button keeps its aria-label (the tooltip is a visual affordance). */}
            <button
                type="button"
                className="btn-reset copy-element-link"
                aria-label={copyLabel}
                data-tooltip-id={tooltipId.current}
                data-tooltip-content={copyLabel}
                data-tooltip-place="top"
                onClick={e => {
                    e.preventDefault();
                    copyToTheClipboard(text);
                    toast.success(useTranslation("Copied to clipboard"));
                }}
            >
                <Icon icon="bx:copy" width={iconSize} />
            </button>
            <SharedTooltip id={tooltipId.current} />
        </div>
    );
};

CopyElement.propTypes = {
    testId: PropTypes.string,
    size: PropTypes.oneOf([
        'default',
        'sm',
    ]),
    text: PropTypes.string.isRequired,
};

export default CopyElement;