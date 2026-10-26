import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {sizes} from "../../constants/forms.jsx";
import {randomAlphabeticString} from "../../utils/strings";
import {SharedTooltip} from "../Tooltip";

const iconWidth = (size) => {
    if (size === 'xs') return 14;
    if (size === 'sm') return 16;
    return 18;
};

/**
 * Accessible icon-only segmented control.
 *
 * Built on native <input type="radio"> sharing a `name`, so roving focus,
 * Arrow-key selection and correct screen-reader announcement all come for free
 * -- no role="radio"/tabIndex/onKeyDown wiring needed. Each radio carries its
 * own `aria-label` (the icon itself is decorative). Controlled via value/onChange.
 *
 * The per-segment hint uses the shared <Tooltip> styling (one <SharedTooltip>
 * portal, anchored on each <label> by data-tooltip-*) instead of a native
 * `title=`. The <input>'s `aria-label` stays -- it is the radio's only
 * accessible name; the tooltip is a visual affordance only.
 */
const IconRadioGroup = ({name, ariaLabel, value, onChange, options, size = 'default', disabled = false, testId}) => {

    const tooltipId = useRef(null);
    if (tooltipId.current === null) {
        tooltipId.current = "tooltip_" + randomAlphabeticString();
    }

    return (
        <React.Fragment>
            <div
                role="radiogroup"
                aria-label={ariaLabel}
                className="acpt-btn-switch-group"
                data-testid={testId || undefined}
            >
                {options.map(option => (
                    <label
                        key={option.value}
                        data-testid={testId ? `${testId}-${option.value}` : undefined}
                        data-tooltip-id={tooltipId.current}
                        data-tooltip-content={option.label}
                        data-tooltip-place="top"
                        className={`acpt-btn-switch ${value === option.value ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            disabled={disabled}
                            onChange={() => onChange(option.value)}
                            aria-label={option.label}
                        />
                        <Icon icon={option.icon} width={iconWidth(size)} />
                    </label>
                ))}
            </div>
            <SharedTooltip id={tooltipId.current} />
        </React.Fragment>
    );
};

IconRadioGroup.propTypes = {
    name: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })).isRequired,
    size: PropTypes.oneOf(sizes),
    disabled: PropTypes.bool,
    testId: PropTypes.string,
};

export default IconRadioGroup;
