import React, {useState} from 'react';
import Button from "../../components/Button";
import {Icon} from "@iconify/react";
import {styleVariants} from "../../constants/styles";
import useTranslation from "../../hooks/useTranslation";
import {scrollToTop} from "../../utils/scroll";

const ScrollToTop = () =>{

    const [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300){
            setVisible(true)
        } else if (scrolled <= 300){
            setVisible(false)
        }
    };

    window.addEventListener('scroll', toggleVisible);

    return (
        <div
            className={`scroll-to-top ${visible ? 'visible' : 'none'}`}
            data-cy="scroll-to-top"
        >
            <Button
                type="button"
                className="with-shadow"
                style={styleVariants.WHITE}
                onClick={scrollToTop}
            >
                <span className="i-flex-center s-8">
                    <Icon
                        icon="bx:up-arrow-alt"
                        size={24}
                    />
                    <span>
                        {useTranslation("Scroll to top")}
                    </span>
                </span>
            </Button>
        </div>
    );
}

export default ScrollToTop;