import {useEffect} from "react";
import {isIterable} from "../utils/objects";

export const useOutsideClick = (refs, callback) => {

    const handleOutsideTitleBoxClick = e => {

        let matches = 0;

        if(isIterable(refs)){
            refs.map((ref)=>{
                if (ref && ref.current && ref.current.contains(e.target)) {
                    matches++;
                }
            });
        }

        if(matches === 0 && typeof callback === 'function'){
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

