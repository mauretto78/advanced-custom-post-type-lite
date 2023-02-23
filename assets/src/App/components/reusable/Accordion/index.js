import React, {useEffect, useState} from 'react';

const Accordion = ({children, handleClick, defaultActiveTab = 0}) => {

    // manage local state
    const [activeTab, setActiveTab] = useState(defaultActiveTab);

    const handleSetActiveTable = (index) => {
        setActiveTab(index);

        if(handleClick){
            handleClick(index);
        }
    };

    useEffect(()=>{
        setActiveTab(defaultActiveTab);
    },[defaultActiveTab]);

    return (
        <div className="acpt-accordion-wrapper">
            {children && children.length > 0 && (
                <React.Fragment>
                    <ul className="acpt-accordion-tabs">
                        {children.map((child, index) => (
                            <li
                                className={`acpt-accordion-tab ${activeTab === index ? 'active' : ''}`}
                                key={index}
                                onClick={e => handleSetActiveTable(index)}
                            >
                                {child.props.title ? child.props.title : `Tab ${index+1}`}
                            </li>
                        ))}
                    </ul>
                    <div className="acpt-accordion-content">
                        {children[activeTab]}
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

export default Accordion;