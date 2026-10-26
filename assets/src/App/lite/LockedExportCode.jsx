import React from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../hooks/useTranslation.jsx";
import ProBadge from "./ProBadge.jsx";
import {upgradeUrl} from "./upgrade.jsx";

/**
 * "Export code" entry of the row actions menus: the code exporter is part of
 * ACPT PRO, so in Lite it opens the upgrade page.
 */
const LockedExportCode = ({feature}) => {

    return (
        <a
            className="acpt-lite-locked-menu-item"
            href={upgradeUrl("export-code", feature)}
            target="_blank"
            rel="noopener noreferrer"
        >
            {useTranslation("Export code")}
            <ProBadge />
        </a>
    );
};

LockedExportCode.propTypes = {
    feature: PropTypes.string.isRequired,
};

export default LockedExportCode;
