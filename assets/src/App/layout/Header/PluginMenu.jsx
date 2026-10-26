import React from 'react';
import useTranslation from "../../hooks/useTranslation";
import {Icon} from "@iconify/react";
import {grayColor} from "../../utils/colors";
import DropdownMenu from "../../components/DropdownMenu";
import {upgradeUrl} from "../../lite/upgrade.jsx";

/**
 * ACPT Lite plugin menu (replaces the ACPT one: no account, license or tickets).
 */
const PluginMenu = () => {

    return (
        <div className="i-flex-center s-8">
            <a
                className="acpt-btn acpt-btn-primary acpt-btn-sm acpt-lite-upgrade-button"
                href={upgradeUrl("plugin-menu")}
                target="_blank"
                rel="noopener noreferrer"
            >
                {useTranslation("Upgrade to PRO")}
            </a>
            <DropdownMenu
                align="right"
                name="plugin-menu"
                label={useTranslation("Plugin menu")}
                anchor={<Icon className="hover-opacity-70" icon="bx:menu-alt-right" color={grayColor()} width={24} />}
                links={[
                    <a href="https://docs.acpt.io" target="_blank" rel="noopener noreferrer">
                        {useTranslation("Documentation")}
                    </a>,
                    <a href="https://wordpress.org/plugins/acpt-lite/#developers" target="_blank" rel="noopener noreferrer">
                        {useTranslation("Changelog")}
                    </a>,
                    <a href="https://wordpress.org/support/plugin/acpt-lite/reviews/#new-post" target="_blank" rel="noopener noreferrer">
                        {useTranslation("Rate ACPT Lite")}
                    </a>,
                    <a href="https://wordpress.org/support/plugin/acpt-lite/" target="_blank" rel="noopener noreferrer">
                        {useTranslation("Support forum")}
                    </a>,
                    <a className="facebook" href="https://www.facebook.com/groups/880817719861018" target="_blank" rel="noopener noreferrer">
                        {useTranslation("Facebook group")}
                    </a>,
                    <a className="color-danger" href={upgradeUrl("plugin-menu", "dropdown")} target="_blank" rel="noopener noreferrer">
                        {useTranslation("Upgrade to PRO")}
                    </a>
                ]}
            />
        </div>
    );
};

export default PluginMenu;
