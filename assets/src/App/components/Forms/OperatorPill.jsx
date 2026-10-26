import React from 'react';
import PropTypes from 'prop-types';

/**
 * Operator pill — displays the current operator as a compact symbol,
 * clickable to cycle through a provided list of operators.
 *
 * Usage:
 *   <OperatorPill
 *     value={watchedOperator}
 *     operators={['=', '!=', 'IN', 'NOT_IN']}
 *     onClick={handleCycle}
 *   />
 */

// ── Symbol map ────────────────────────────────────────────────────────────────
// Maps operator values to the compact symbol shown on the pill.

export const OPERATOR_SYMBOLS = {
    '=':           '=',
    '!=':          '≠',
    '>':           '>',
    '<':           '<',
    '>=':          '≥',
    '<=':          '≤',
    'IN':          'IN',
    'NOT_IN':      '∉',
    'LIKE':        '~',
    'NOT_LIKE':    '≁',
    'BLANK':       '∅',
    'NOT_BLANK':   '¬∅',
    'NULL':        'null',
    'NOT_NULL':    '¬null',
    'CHECKED':     '✓',
    'NOT_CHECKED': '✗',
    'MAX':         'max',
    'MIN':         'min',
    'REGEX':       'rx',
};

// ── CSS class map ─────────────────────────────────────────────────────────────

const OPERATOR_CLASSES = {
    '=':           'acpt-pill-op-eq',
    '!=':          'acpt-pill-op-neq',
    '>':           'acpt-pill-op-gt',
    '<':           'acpt-pill-op-lt',
    '>=':          'acpt-pill-op-gte',
    '<=':          'acpt-pill-op-lte',
    'IN':          'acpt-pill-op-in',
    'NOT_IN':      'acpt-pill-op-not-in',
    'LIKE':        'acpt-pill-op-like',
    'NOT_LIKE':    'acpt-pill-op-not-like',
    'BLANK':       'acpt-pill-op-blank',
    'NOT_BLANK':   'acpt-pill-op-not-blank',
    'NULL':        'acpt-pill-op-null',
    'NOT_NULL':    'acpt-pill-op-null',
    'CHECKED':     'acpt-pill-op-checked',
    'NOT_CHECKED': 'acpt-pill-op-not-checked',
    'MAX':         'acpt-pill-op-gt',
    'MIN':         'acpt-pill-op-lt',
    'REGEX':       'acpt-pill-op-like',
};

const OperatorPill = ({value = null, operators, onClick, disabled = false}) => {

    const symbol        = OPERATOR_SYMBOLS[value] ?? '—';
    const variantClass  = OPERATOR_CLASSES[value]  ?? '';
    const next = operators.indexOf(value) + 1;
    const nextOperator = operators[next % operators.length];

    const handleActivate = () => onClick(nextOperator);

    return (
        <span
            className={`acpt-pill acpt-pill-operator ${variantClass}${disabled ? ' is-disabled' : ''}`}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            onClick={disabled ? undefined : handleActivate}
            onKeyDown={disabled ? undefined : (e) => {
                if(e.key === 'Enter' || e.key === ' '){
                    e.preventDefault();
                    handleActivate();
                }
            }}
            title={value ?? ''}
        >
            {symbol}
        </span>
    );
};

OperatorPill.propTypes = {
    /** Current operator value e.g. '=', '!=', 'IN'. */
    value:     PropTypes.string,
    /**
     * Ordered list of operator values to cycle through on click.
     * The component cycles: current → next in array → wraps around.
     */
    operators: PropTypes.arrayOf(PropTypes.string).isRequired,
    /** Called with the next operator value after a click. */
    onClick:   PropTypes.func.isRequired,
    /** Disables cycling when true. */
    disabled:  PropTypes.bool,
};

export default OperatorPill;
