import React, {useEffect, useRef, useState} from 'react';
import {useOutsideClick} from "../../hooks/useOutsideClick";
import PropTypes from "prop-types";
import {styleVariants} from "../../constants/styles";
import {isRTLOrientation} from "../../utils/misc";

const DropdownMenu = ({name, label, buttonClass, align = "left", anchor, links}) => {

    // local settings
    const [isVisible, setIsVisible] = useState(false);
    const node = useRef();
    const toggleRef = useRef();

    // Must also ignore the toggle button itself: a real click dispatches
    // mousedown before click, so without toggleRef here the outside-click
    // handler would close the menu on mousedown, then the button's own
    // onClick would immediately reopen it -- clicking the open toggle could
    // never close it.
    useOutsideClick([node, toggleRef], () => {
        setIsVisible(false);
    });

    // Escape-to-close, focus restored to the toggle button — matches
    // Modal's focus management. Scoped to only listen while open.
    useEffect(() => {
        if(!isVisible){
            return;
        }

        const handleKeyDown = (e) => {
            if(e.key === 'Escape'){
                e.stopPropagation();
                setIsVisible(false);
                toggleRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isVisible]);

    return (
        <div className={`acpt-dropdown-wrapper align-${align}`}>
            <button
                ref={toggleRef}
                type="button"
                className={buttonClass ? `acpt-btn acpt-btn-mini acpt-btn-${buttonClass}` : "btn-reset"}
                data-testid={name ? `button-${name}` : null}
                aria-label={label}
                aria-haspopup="true"
                aria-expanded={isVisible}
                onClick={e => {
                    e.preventDefault();
                    setIsVisible(!isVisible);
                }}
            >
                {anchor}
            </button>
            <ul
                data-testid={name}
                ref={node}
                className={`acpt-dropdown ${isVisible ? 'visible': ''} ${isRTLOrientation()}`}
            >
                {/* Only mounted while open — items must not be Tab-reachable
                    when the menu is visually hidden (opacity/height, not
                    display:none, so the DOM nodes would otherwise still be
                    focusable). */}
                {isVisible && links && links.map((link, index) => (
                    <li key={index}>
                        {link}
                    </li>
                ))}
            </ul>
        </div>
    );
};

DropdownMenu.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string.isRequired,
    align: PropTypes.oneOf([
        "left",
        "right"
    ]),
    buttonClass: PropTypes.oneOf(Object.values(styleVariants)),
    anchor: PropTypes.element.isRequired,
    links: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default DropdownMenu;