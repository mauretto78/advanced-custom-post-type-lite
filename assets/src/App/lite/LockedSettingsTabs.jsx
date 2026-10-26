import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import useTranslation from "../hooks/useTranslation.jsx";
import {upgradeUrl} from "./upgrade.jsx";

/**
 * Static preview of a field setting available in ACPT PRO: what it does, and
 * a link to upgrade. There is no PRO code behind it.
 */
const LockedFeature = ({feature, description, bullets}) => {

    return (
        <div className="canvas-settings acpt-lite-locked-feature flex-column s-12 p-24">
            <p>{description}</p>
            <ul className="flex-column s-8">
                {bullets.map((bullet, index) => (
                    <li key={index} className="i-flex-center s-8">
                        <Icon icon="bx:check" width={16} />
                        <span>{bullet}</span>
                    </li>
                ))}
            </ul>
            <a
                className="acpt-btn acpt-btn-primary acpt-btn-sm i-flex-center s-8"
                href={upgradeUrl("field-settings", feature)}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Icon icon="bx:lock-open-alt" width={16} />
                {useTranslation("Unlock with ACPT PRO")}
            </a>
        </div>
    );
};

LockedFeature.propTypes = {
    feature: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    bullets: PropTypes.arrayOf(PropTypes.string).isRequired,
};

/**
 * Accordion items appended to the field settings panel in ACPT Lite.
 *
 * @return {{title: string, content: JSX.Element}[]}
 */
export const lockedSettingsTabs = () => [
    {
        title: `${useTranslation("Advanced options")} · PRO`,
        content: (
            <LockedFeature
                feature="advanced-options"
                description={useTranslation("Fine-tune how every field looks and behaves.")}
                bullets={[
                    useTranslation("Placeholders, prefixes and suffixes"),
                    useTranslation("Min/max values, step and length limits"),
                    useTranslation("Custom CSS classes and column width"),
                ]}
            />
        ),
    },
    {
        title: `${useTranslation("Conditional rendering")} · PRO`,
        content: (
            <LockedFeature
                feature="conditional-rendering"
                description={useTranslation("Show or hide a field depending on the value of other fields.")}
                bullets={[
                    useTranslation("Rules combined with AND/OR logic"),
                    useTranslation("Live in the editor, applied on the front end"),
                ]}
            />
        ),
    },
    {
        title: `${useTranslation("Validation rules")} · PRO`,
        content: (
            <LockedFeature
                feature="validation-rules"
                description={useTranslation("Reject invalid data before it is saved.")}
                bullets={[
                    useTranslation("Regex, length, numeric and size rules"),
                    useTranslation("Custom error messages"),
                ]}
            />
        ),
    },
    {
        title: `${useTranslation("Permissions")} · PRO`,
        content: (
            <LockedFeature
                feature="permissions"
                description={useTranslation("Decide which user roles can see or edit each field.")}
                bullets={[
                    useTranslation("Edit, read-only or hidden per role"),
                ]}
            />
        ),
    },
];
