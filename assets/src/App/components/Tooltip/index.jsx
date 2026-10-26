import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {Tooltip as ReactTooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import {randomAlphabeticString} from "../../utils/strings";
import {primaryColor, surfaceColorRaised, baseColor} from "../../utils/colors";

/**
 * The one themed <ReactTooltip> portal, shared so anything wiring an anchor by
 * hand (e.g. Forms/IconRadioGroup) gets the same look + WCAG 1.4.13 behaviour
 * (dismissible with Escape, hoverable) as <Tooltip>.
 *
 * `positionStrategy="fixed"` is required, not cosmetic: react-tooltip renders the
 * tip in place, so inside the Canvas toolbar it would otherwise be `position:
 * absolute` inside `.canvas-wrapper` (a flex item with `z-index: 100000`) -- a
 * stacking context it cannot escape with any z-index, and it gets clipped by the
 * toolbar. `fixed` anchors it to the viewport instead; the z-index then just has
 * to clear the canvas layers (`.z-index-top` is 100001).
 */
export const SharedTooltip = ({id}) => (
    <ReactTooltip
        id={id}
        clickable
        positionStrategy="fixed"
        globalCloseEvents={{escape: true}}
        style={{
            backgroundColor: surfaceColorRaised(),
            color: baseColor(),
            zIndex: 100002,
        }}
    />
);

SharedTooltip.propTypes = {
    id: PropTypes.string.isRequired,
};

/**
 * Shared tooltip: a hover/focus hint attached to an anchor.
 *
 * Two shapes, chosen by the type of `label`:
 *
 *  - `label` is a string -> the anchor is a real, focusable <button> carrying a
 *    "?" help glyph (unless `icon={false}`). The tip is exposed to assistive tech
 *    as the button's description (visually-hidden node + aria-describedby), or as
 *    its accessible name when there is no visible label text.
 *
 *  - `label` is an element (an icon button, a switch, a modal trigger, ...) -> the
 *    anchor is a plain <span> wrapper. An interactive element must NOT be nested
 *    inside a <button> (invalid HTML, a second focus stop, "button button" in a
 *    screen reader). The caller's own control provides focus and its own
 *    aria-label -- which at every such call site already equals `tip` -- so no
 *    extra description node is added. Trade-off: for this shape the *visual*
 *    tooltip opens on pointer hover only, not on keyboard focus of the inner
 *    control; acceptable because the accessible name is already present.
 *
 * WCAG 1.4.13: the shared <ReactTooltip> is dismissible (Escape) and hoverable
 * (`clickable`).
 */
const Tooltip = ({label, tip, icon = true}) => {

    // Stable for the component's lifetime so aria-describedby / the react-tooltip
    // anchor association do not churn on every re-render.
    const idRef = useRef(null);
    if (idRef.current === null) {
        idRef.current = "tooltip_" + randomAlphabeticString();
    }
    const id = idRef.current;
    const descId = `${id}_desc`;

    const hasTextLabel = typeof label === 'string';
    const hasVisibleText = hasTextLabel && label.trim() !== "";

    const anchorProps = {
        'data-tooltip-id': id,
        'data-tooltip-content': tip,
        'data-tooltip-place': 'top',
    };

    return (
        <span className="acpt-tooltip">
            {hasTextLabel ? (
                <button
                    type="button"
                    className={`i-flex-center cursor-help btn-reset ${label !== "" ? "s-8" : ""}`}
                    aria-label={hasVisibleText ? undefined : tip}
                    aria-describedby={hasVisibleText ? descId : undefined}
                    {...anchorProps}
                >
                    <span className="acpt-tooltip-label">
                        {label}
                    </span>
                    {icon && (
                        <span className={`acpt-tooltip-help ${label !== "" ? "top-2" : ""}`} aria-hidden="true">
                            <Icon icon="bx:help-circle" color={primaryColor()} width="18px" />
                        </span>
                    )}
                </button>
            ) : (
                <span className="i-flex-center" {...anchorProps}>
                    {label}
                </span>
            )}
            {hasVisibleText && (
                <span id={descId} className="screen-reader-text">{tip}</span>
            )}
            <SharedTooltip id={id} />
        </span>
    );
};

Tooltip.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    tip: PropTypes.string.isRequired,
    icon: PropTypes.bool,
};

export default Tooltip;
