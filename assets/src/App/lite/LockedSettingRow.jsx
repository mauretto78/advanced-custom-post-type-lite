import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import useTranslation from "../hooks/useTranslation.jsx";
import CardRow from "../components/Card/CardRow.jsx";
import ProBadge from "./ProBadge.jsx";
import {upgradeUrl} from "./upgrade.jsx";

/**
 * A setting available in ACPT PRO, shown as a disabled toggle. The checkbox is
 * not registered in the form, so nothing is ever saved for it.
 */
const LockedSettingRow = ({feature, label, description}) => {

    const id = `lite-locked-${feature}`;

    return (
        <CardRow
            label={
                <span className="i-flex-center s-8">
                    {label}
                    <ProBadge />
                </span>
            }
            value={
                <div className="toggle-group disabled default acpt-lite-locked-setting">
                    <span className="toggle">
                        <input
                            id={id}
                            type="checkbox"
                            disabled
                            checked={false}
                            readOnly
                            data-testid={`toggle-checkbox-${id}`}
                        />
                        <span className="slider round"/>
                    </span>
                    <span className="form-description disabled">
                        {description}
                        {" "}
                        <a
                            href={upgradeUrl("settings", feature)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="i-flex-center s-4"
                        >
                            <Icon icon="bx:lock-open-alt" width={14} />
                            {useTranslation("Unlock with ACPT PRO")}
                        </a>
                    </span>
                </div>
            }
        />
    );
};

LockedSettingRow.propTypes = {
    feature: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default LockedSettingRow;
