import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import Tab from "./Tab";
import {randomAlphabeticString} from "../../utils/strings";
import {useTabsKeyboardNav} from "../../hooks/useTabsKeyboardNav";

const Tabs = ({handleClick, defaultActiveTab = 0, children, halfMargin, isValid = true, testId = null, keepMounted = false}) => {

    // manage local state
    const [activeTab, setActiveTab] = useState(defaultActiveTab);
    const [id] = useState(() => randomAlphabeticString());

    const handleSetActiveTab = (index) => {

        if(handleClick){
            const result = handleClick(index);

            if(result === false){
                return;
            }
        }

        setActiveTab(index);
    };

    const {getTabProps} = useTabsKeyboardNav(activeTab, handleSetActiveTab, children?.length ?? 0);

    useEffect(() => {
        setActiveTab(defaultActiveTab);
    },[defaultActiveTab]);

    return (
        <div className="acpt-tabs" id={`tabs-${id}`}>
            {children && children?.length > 0 && (
                <React.Fragment>
                    <ul
                        data-testid={testId ? testId : null}
                        role="tablist"
                        className={`acpt-tablist ${isValid ? "valid" : "invalid"} ${halfMargin ? "mb-12": "mb-24"}`}
                    >
                        {children?.map((child, index) => {

                            if(!child){
                                return null;
                            }

                            return (
                                <li
                                    data-testid={`tab-${id}-${index+1}`}
                                    id={`tab-${id}-${index+1}`}
                                    aria-controls={`tabpanel-${id}-${index+1}`}
                                    className={`acpt-accordion-tab ${child.props.style ? child.props.style : ''} ${activeTab === index ? 'active' : ''}`}
                                    key={index}
                                    {...getTabProps(index)}
                                >
                                    {(child.props && child.props.title) ? child.props.title : `Tab ${index+1}`}
                                </li>
                            );

                        })}
                    </ul>
                    {keepMounted
                        ? children?.map((child, index) => {
                            if (!child) {
                                return null;
                            }

                            return (
                                <div
                                    key={index}
                                    data-testid={`tabpanel-${id}-${index+1}`}
                                    id={`tabpanel-${id}-${index+1}`}
                                    className="acpt-tab-panel"
                                    role="tabpanel"
                                    tabIndex={0}
                                    aria-labelledby={`tab-${id}-${index+1}`}
                                    hidden={activeTab !== index}
                                >
                                    {child}
                                </div>
                            );
                        })
                        : children[activeTab] && (
                            <div
                                data-testid={`tabpanel-${id}-${activeTab+1}`}
                                id={`tabpanel-${id}-${activeTab+1}`}
                                className="acpt-tab-panel"
                                role="tabpanel"
                                tabIndex={0}
                                aria-labelledby={`tab-${id}-${activeTab+1}`}
                            >
                                {children[activeTab]}
                            </div>
                        )
                    }
                </React.Fragment>
            )}
        </div>
    );
};

Tabs.propTypes = {
    handleClick: PropTypes.func,
    defaultActiveTab: PropTypes.number,
    setDefaultActiveTab: PropTypes.func,
    halfMargin: PropTypes.bool,
    isValid: PropTypes.bool,
    testId: PropTypes.string,
    // Keeps every tab panel mounted (hidden via the native `hidden` attribute
    // instead of being unmounted) rather than only rendering children[activeTab].
    // Opt-in, default false -- preserves existing behavior for every other
    // consumer. See Settings/index.jsx for why this exists (ticket #1209).
    keepMounted: PropTypes.bool,
    // A single <Tab> child arrives as one element, not an array -- children?.length
    // is then undefined and the whole tablist/panel intentionally doesn't render
    // (see the "known quirk" test in Tabs.test.js). Accept both shapes so that
    // documented, real usage doesn't fail PropTypes; arrayOf(Tab) was also never
    // a valid type-checker to begin with (Tab is a component, not a PropTypes validator).
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default Tabs;
