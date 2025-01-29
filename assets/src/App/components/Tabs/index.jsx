import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import Tab from "./Tab";
import {randomAlphabeticString} from "../../utils/strings";

const Tabs = ({handleClick, defaultActiveTab = 0, children, halfMargin}) => {

    // manage local state
    const [activeTab, setActiveTab] = useState(defaultActiveTab);
    const id = randomAlphabeticString();

    const handleSetActiveTab = (index) => {
        setActiveTab(index);

        if(handleClick){
            handleClick(index);
        }
    };

    useEffect(()=>{
        setActiveTab(defaultActiveTab);
    },[defaultActiveTab]);

    return (
        <div className="acpt-tabs" id={`tabs-${id}`}>
            {children && children.length > 0 && (
                <React.Fragment>
                    <ul
                        role="tablist"
                        className={`tablist ${halfMargin ? "mb-12": "mb-24"}`}
                    >
                        {children.map((child, index) => {

                            if(!child){
                                return null;
                            }

                            return (
                                <li
                                    data-cy={`tab-${id}-${index+1}`}
                                    id={`tab-${id}-${index+1}`}
                                    aria-selected={activeTab === index}
                                    aria-controls={`tabpanel-${id}-${index+1}`}
                                    tabIndex={index+1}
                                    role="tab"
                                    className={`acpt-accordion-tab ${child.props.style ? child.props.style : ''} ${activeTab === index ? 'active' : ''}`}
                                    key={index}
                                    onClick={e => handleSetActiveTab(index)}
                                >
                                    {(child.props && child.props.title) ? child.props.title : `Tab ${index+1}`}
                                </li>
                            );

                        })}
                    </ul>
                    <div
                        data-cy={`tabpanel-${id}-${activeTab+1}`}
                        id={`tabpanel-${id}-${activeTab+1}`}
                        className="tab-panel"
                        role="tabpanel"
                        tabIndex={activeTab+1}
                        aria-labelledby={`tab-${id}-${activeTab+1}`}
                    >
                        {children[activeTab]}
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

Tabs.propTypes = {
    handleClick: PropTypes.func,
    defaultActiveTab: PropTypes.number,
    halfMargin: PropTypes.bool,
    children: PropTypes.arrayOf(Tab)
};

export default Tabs;
