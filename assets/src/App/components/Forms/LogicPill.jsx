import React from 'react';
import PropTypes from 'prop-types';

/**
 * Clickable pill that cycles between AND and OR.
 * Renders null when disabled — use for the last rule in a set.
 *
 * Usage:
 *   <LogicPill value={watchedLogic} onClick={handleCycle} disabled={isLast} />
 */
const LogicPill = ({value = null, onClick, disabled = false}) => {

    if (disabled) return null;

    const variantClass = value === 'AND'
        ? 'acpt-pill-and'
        : value === 'OR'
            ? 'acpt-pill-or'
            : '';

    return (
        <span
            className={`acpt-pill ${variantClass}`}
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if(e.key === 'Enter' || e.key === ' '){
                    e.preventDefault();
                    onClick(e);
                }
            }}
        >
            {value || '—'}
        </span>
    );
};

LogicPill.propTypes = {
    /** Current value — 'AND' or 'OR'. Shows 'AND' if null/undefined. */
    value:    PropTypes.oneOf(['AND', 'OR', null]),
    /** Called on click. Should cycle the value externally. */
    onClick:  PropTypes.func.isRequired,
    /**
     * When true the pill is not rendered at all.
     * Use for the last rule in a set where logic has no meaning.
     */
    disabled: PropTypes.bool,
};

export default LogicPill;
