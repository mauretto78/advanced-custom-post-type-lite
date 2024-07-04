import {useEffect} from "react";

export const useOutsideClick = (ref, callback) => {

    const handleOutsideTitleBoxClick = e => {
        if (ref && ref.current && !ref.current.contains(e.target)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideTitleBoxClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideTitleBoxClick);
        };
    }, [ref]);
};

