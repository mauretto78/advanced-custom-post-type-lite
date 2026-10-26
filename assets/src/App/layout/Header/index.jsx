import React, {useRef, useState, useEffect} from 'react';
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
            <div className="acpt-header-bottom">
                <div className={`p-24 pb-12 flex-between for-xs`}>
                    {typeof title === 'string' ? <h1>{title}</h1> : title}
                    {actions && (
                        <div className="i-flex-center s-8 for-xs mt-8-for-xs">
                            {actions.map((action, index) => action.key !== null
                                ? action
                                : React.cloneElement(action, {key: index}))}
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

Header.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    actions: PropTypes.arrayOf(PropTypes.element)
};

export default Header;