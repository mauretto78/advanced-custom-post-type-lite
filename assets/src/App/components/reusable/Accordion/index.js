import React, {useState} from 'react';

const Accordion = ({children}) => {

    // manage local state
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="acpt-accordion-wrapper">
            {children && children.length > 0 && (
                <React.Fragment>
                    <ul className="acpt-accordion-tabs">
                        {children.map((child, index) => (
                            <li
                                className={`acpt-accordion-tab ${activeTab === index ? 'active' : ''}`}
                                key={index}
                                onClick={e => setActiveTab(index)}
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