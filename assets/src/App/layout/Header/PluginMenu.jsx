import React, {useRef, useState} from 'react';
import useTranslation from "../../hooks/useTranslation";
import {Icon} from "@iconify/react";
import {useOutsideClick} from "../../hooks/useOutsideClick";

const PluginMenu = () => {

    // global settings
    const settings = document.globals;

    // local settings
    const [isVisible, setIsVisible] = useState(false);
    const node = useRef();

    useOutsideClick(node, () => {
        setIsVisible(false);
    });

    return (
        <div className="relative">
            <a
                data-cy="button-plugin-menu"
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setIsVisible(!isVisible);
                }}
            >
                <Icon icon="bx:menu-alt-right" color="#777" width={24} />
            </a>
            <nav
                data-cy="plugin-menu"
                ref={node}
                className={`acpt-nav ${isVisible ? 'visible': ''} ${settings.globals.is_rtl ? 'rtl' : ''}`}
            >
                <a href="https://docs.acpt.io" target="_blank">
                    {useTranslation("Documentation")}
                </a>
                <a href="https://wordpress.org/plugins/acpt-lite/#developers" target="_blank">
                    {useTranslation("Changelog")}
                </a>
                <a href="https://wordpress.org/plugins/acpt-lite/#reviews" target="_blank">
                    {useTranslation("Rate this plugin")}
                </a>
                <a className="facebook" href="https://www.facebook.com/groups/880817719861018" target="_blank">
                    {useTranslation("Facebook group")}
                </a>
                <a className="color-danger" href="https://acpt.io/checkout/" target="_blank">
                    {useTranslation("Upgrade to PRO")}
                </a>
            </nav>
        </div>
    );
};

export default PluginMenu;