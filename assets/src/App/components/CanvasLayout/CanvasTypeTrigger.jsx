import React, {useId} from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation.jsx";
import Tooltip from "../Tooltip";

/**
 * The click-to-open affordance around a field/column/control type badge on a
 * Canvas element row. Shared by every manager's CanvasInlineFieldType.
 *
 * The badge's own text ("Text", "Select", ...) stays the accessible name; the
 * "click to change the type" hint is added as a description (visually-hidden
 * node + aria-describedby) and as the visual <Tooltip>. The <Tooltip> is used in
 * its element-label shape (label is not a string), so it only adds data-* on a
 * <span> wrapper -- no nested button.
 */
const CanvasTypeTrigger = ({onActivate, className, children}) => {

    const hintId = useId();
    const hint = useTranslation("Click to change the type");

    return (
        <React.Fragment>
            <span
                role="button"
                tabIndex={0}
                aria-describedby={hintId}
                className={`cursor-pointer ${className ?? ''}`}
                onClick={e => { e.stopPropagation(); onActivate(); }}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        onActivate();
                    }
                }}
            >
                <Tooltip label={<React.Fragment>{children}</React.Fragment>} tip={hint} icon={false} />
            </span>
            <span id={hintId} className="screen-reader-text">{hint}</span>
        </React.Fragment>
    );
};

CanvasTypeTrigger.propTypes = {
    onActivate: PropTypes.func.isRequired,
    className:  PropTypes.string,
    children:   PropTypes.node.isRequired,
};

export default CanvasTypeTrigger;
