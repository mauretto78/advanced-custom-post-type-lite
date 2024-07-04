import {useEffect} from "react";

export const useInsideClick = (ref, callback) => {

    const handleInsideClick = e => {
        if (ref && ref.current && ref.current.contains(e.target)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleInsideClick);

        return () => {
            document.removeEventListener("mousedown", handleInsideClick);
        };
    }, [ref]);
};

