import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {styleVariants} from "../constants/styles.jsx";
import useTranslation from "../hooks/useTranslation.jsx";
import Badge from "../components/Badge/index.jsx";
import ProBadge from "./ProBadge.jsx";
import {upgradeUrl} from "./upgrade.jsx";

/**
 * A tool available in ACPT PRO, greyed out on the Tools page. Its page does not
 * exist in Lite: the link opens the upgrade page.
 */
const LockedToolCard = ({title, color = styleVariants.SECONDARY, header, description, icon, link}) => {

    const css = {
        display: "inline-flex",
        alignItems: "center",
        width: "24px",
        height: "32px",
        justifyContent: "center"
    };

    return (
        <div className="p-24 bg-white with-border b-rounded flex-column s-24 acpt-lite-locked-tool">
            <div>
                <div className="mb-12">
                    <Badge css={css} style={color}>
                        <Icon icon={icon} width={24} />
                    </Badge>
                </div>
                <span className="uppercase font-sm color-medium-gray">{header}</span>
                <h2
                    className="flex-center s-8"
                    data-testid={`title-${link}`}
                >
                    {useTranslation(title)}
                    <ProBadge />
                </h2>
            </div>
            <div
                data-testid={`description-${link}`}
                style={{flex: 1, flexGrow: 1}}
            >
                {useTranslation(description)}
            </div>
            <div>
                <a
                    className="acpt-btn acpt-btn-outlined-primary acpt-btn-xs i-flex-center s-8"
                    data-testid={`link-${link}`}
                    href={upgradeUrl("tools", link)}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Icon icon="bx:lock-alt" width={14} />
                    {useTranslation("Available in ACPT PRO")}
                </a>
            </div>
        </div>
    );
};

LockedToolCard.propTypes = {
    title: PropTypes.string.isRequired,
    color: PropTypes.oneOf(Object.values(styleVariants)).isRequired,
    header: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

export default LockedToolCard;
