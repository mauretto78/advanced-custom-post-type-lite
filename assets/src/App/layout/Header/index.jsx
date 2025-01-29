import React from 'react';
import PropTypes from 'prop-types';
import Logo from "./Logo";
import VersionBadge from "../../components/VersionBadge";
import LanguageMenu from "./LanguageMenu";
import PluginMenu from "./PluginMenu";

const Header = ({title, actions}) => {

    return (
        <React.Fragment>
            <div className="acpt-header-top flex-between">
                <div className="i-flex-center s-8">
                    <Logo/>
                    <VersionBadge/>
                </div>
                <div className="i-flex-center s-8">
                    <LanguageMenu/>
                    <PluginMenu />
                </div>
            </div>
            <div className="acpt-header-bottom flex-between for-xs">
                {typeof title === 'string' ? <h1>{title}</h1> : title}
                {actions && (
                    <div className="i-flex-center s-8 for-xs">
                        {actions.map((action)=> action)}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

Header.propTypes = {
    title: PropTypes.string.isRequired,
    actions: PropTypes.element
};

export default Header;