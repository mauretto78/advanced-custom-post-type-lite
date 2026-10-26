import {useEffect} from "react";
import {isIterable} from "../utils/objects";

export const useOutsideClick = (refs, callback) => {

    const handleOutsideTitleBoxClick = e => {

        // if the clicked element is no longer in the DOM
        // (e.g. a dropdown that unmounted on click), ignore it
        if (!document.contains(e.target)) return;

        // Ignore clicks inside modals or overlays
        if (e.target.closest('.acpt-overlay')) return;

        let matches = 0;

        if (isIterable(refs)) {
            refs.map((ref) => {
                if (ref && ref.current && ref.current.contains(e.target)) {
                    matches++;
                }
            });
        }

        if (matches === 0 && typeof callback === 'function') {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideTitleBoxClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideTitleBoxClick);
        };
    }, [refs]);
};