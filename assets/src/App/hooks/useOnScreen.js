import {useEffect, useMemo, useState} from "react";

export const useOnScreen = (ref) => {

    const [isIntersecting, setIsIntersecting] = useState(false);

    const observer = useMemo(
        () =>
            new IntersectionObserver(([entry]) =>
                setIsIntersecting(entry.isIntersecting),
            ),
        [],
    );

    useEffect(() => {
        if(ref.current){
            observer.observe(ref.current);

            return () => {
                observer.disconnect();
            };
        }
    }, [ref, observer]);

    return isIntersecting;
};