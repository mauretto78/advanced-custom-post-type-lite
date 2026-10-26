import React, {useState} from 'react';
import PropTypes from 'prop-types';
import AccordionItem from "./AccordionItem.jsx";

const Accordion = ({ items, defaultTab = 0 }) => {

    const [openIndex, setOpenIndex] = useState(defaultTab);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="acpt-accordion">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    content={item.content}
                    isOpen={openIndex === index}
                    onToggle={() => handleToggle(index)}
                />
            ))}
        </div>
    );
};

// PropTypes for Accordion
Accordion.propTypes = {
    defaultTab: PropTypes.number,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            content: PropTypes.node.isRequired,
        })
    ).isRequired,
};

export default Accordion;