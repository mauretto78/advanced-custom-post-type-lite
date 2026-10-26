import {useRef} from "react";

export const useTabsKeyboardNav = (activeIndex, setActiveIndex, count) => {

    const tabRefs = useRef({});

    const moveFocus = (targetIndex) => {
        setActiveIndex(targetIndex);
        tabRefs.current[targetIndex]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            setActiveIndex(index);
            return;
        }

        const arrowKeys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];

        if(!arrowKeys.includes(e.key)){
            return;
        }

        e.preventDefault();

        let nextIndex = index;

        if(e.key === 'ArrowRight'){
            nextIndex = (index + 1) % count;
        } else if(e.key === 'ArrowLeft'){
            nextIndex = (index - 1 + count) % count;
        } else if(e.key === 'Home'){
            nextIndex = 0;
        } else if(e.key === 'End'){
            nextIndex = count - 1;
        }

        moveFocus(nextIndex);
    };

    const getTabProps = (index) => ({
        ref: (el) => { tabRefs.current[index] = el; },
        role: 'tab',
        tabIndex: activeIndex === index ? 0 : -1,
        'aria-selected': activeIndex === index,
        onClick: () => setActiveIndex(index),
        onKeyDown: (e) => handleKeyDown(e, index),
    });

    return {getTabProps};
};
