import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {grayColor} from "../../utils/colors.jsx";

const AccordionItem = ({ title, content, isOpen = false, onToggle }) => {

    // Tracks whether the grid-template-rows expand/collapse transition is in
    // flight, so the wrapper only needs to stay overflow:hidden for its
    // duration — otherwise a scroll gesture that lands while it's still
    // hidden (but visually already open) gets silently dropped.
    const isFirstRender = useRef(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setIsAnimating(true);
    }, [isOpen]);

    return (
        <div className="acpt-accordion-item">
            <div className="px-24 py-14 b-bottom-1 cursor-pointer">
                <button
                    type="button"
                    className="btn-reset flex-between s-8 w-100 text-left"
                    onClick={onToggle}
                    aria-expanded={isOpen}
                >
                <span className={`uppercase color-black ${isOpen ? "text-bold" : ""}`}>
                    {title}
                </span>
                    <Icon
                        icon={isOpen ? 'bx:minus' : 'bx:plus'}
                        width={14}
                        color={grayColor()}
                    />
                </button>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 300ms ease-out',
                    overflow: (isOpen && !isAnimating) ? 'visible' : 'hidden'
                }}
                onTransitionEnd={e => {
                    if (e.propertyName === 'grid-template-rows') setIsAnimating(false);
                }}
                className="acpt-accordion-content"
            >
                <div style={{ minHeight: '0' }}>
                    <div className="b-bottom-1">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

// PropTypes for AccordionItem
AccordionItem.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    isOpen: PropTypes.bool,
    onToggle: PropTypes.func.isRequired,
};

export default AccordionItem;