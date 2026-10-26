import React from 'react';
import PropTypes from 'prop-types';
import {styleVariants} from "../../constants/styles.jsx";
import useTranslation from "../../hooks/useTranslation.jsx";
import {Icon} from "@iconify/react";
import ButtonLink from "../../components/ButtonLink";
import Badge from "../../components/Badge/index.jsx";

const ToolCard = ({title, color = styleVariants.SECONDARY, header, description, icon, link, textLink}) => {

    const css = {
        display: "inline-flex",
        alignItems: "center",
        width: "24px",
        height: "32px",
        justifyContent: "center"
    };

    return (
        <div className="p-24 bg-white with-border b-rounded flex-column s-24">
            <div>
                <div className="mb-12">
                    <Badge css={css} style={color}>
                        <Icon icon={icon} width={24} />
                    </Badge>
                </div>
                <span className="uppercase font-sm color-medium-gray">{header}</span>
                <h2
                    aria-label={useTranslation(title)}
                    data-testid={`title-${link}`}
                >
                    {useTranslation(title)}</h2>
            </div>
            <div
                data-testid={`description-${link}`}
                style={{flex: 1, flexGrow: 1}}
            >
                {useTranslation(description)}
            </div>
            <div>
                <ButtonLink
                    ariaLabel={useTranslation(textLink)}
                    testId={`link-${link}`}
                    style={styleVariants.OUTLINED_PRIMARY}
                    size="xs"
                    icon="boxicons:arrow-right-stroke"
                    to={link}
                >
                    {useTranslation(textLink)}
                </ButtonLink>
            </div>
        </div>
    );
};

ToolCard.propTypes = {
    title: PropTypes.string.isRequired,
    color: PropTypes.oneOf(Object.values(styleVariants)).isRequired,
    header: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    textLink: PropTypes.string.isRequired,
};

export default ToolCard;