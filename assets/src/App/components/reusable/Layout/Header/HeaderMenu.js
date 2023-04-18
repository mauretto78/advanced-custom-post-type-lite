import React, {useEffect, useRef} from 'react';
import {Link} from "react-router-dom";

const HeaderMenu = ({isVisible, setIsVisible}) => {

    const node = useRef();
    const handleOutsideTitleBoxClick = e => {
        if (node && !node.current.contains(e.target)) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideTitleBoxClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideTitleBoxClick);
        };
    }, []);

    return (
        <nav
            ref={node}
            className={`nav ${isVisible ? 'visible': ''}`}
        >
            <a href="https://acpt.io/documentation" target="_blank">
                Documentation
            </a>
            <a href="https://wordpress.org/plugins/acpt-lite/#developers" target="_blank">
                Changelog
            </a>
            <a href="https://wordpress.org/plugins/acpt-lite/#reviews" target="_blank">
                Rate this plugin
            </a>
            <a className="facebook" href="https://www.facebook.com/groups/880817719861018" target="_blank">
                Facebook group
            </a>
            <a className="acpt-text-accent" href="https://acpt.io/checkout/" target="_blank">
                Upgrade to PRO
            </a>
        </nav>
    );
};

export default HeaderMenu;