import React from 'react';
import useTranslation from "../../hooks/useTranslation";

const Footer = () => {

    return (
        <div
            className="acpt-footer"
            data-cy="acpt-footer"
        >
            {useTranslation("Copyright")} &copy; 2021 - {new Date().getFullYear()} &nbsp;
            <a href="https://acpt.io" target="_blank">ACPT</a>
        </div>
    );
};

export default Footer;