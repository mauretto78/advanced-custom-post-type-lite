import {useEffect, useMemo, useState} from "react";

export const useOnScreen = (ref) => {

    const [isIntersecting, setIsIntersecting] = useState(false);
    const observer = useMemo(
        () =>
            new IntersectionObserver(([entry]) => {
                if(
                    entry.boundingClientRect.x === 0 &&
                    entry.boundingClientRect.y === 0 &&
                    entry.boundingClientRect.bottom === 0 &&
                    entry.boundingClientRect.left === 0 &&
                    entry.boundingClientRect.right === 0 &&
                    entry.boundingClientRect.top === 0 &&
                    entry.boundingClientRect.width === 0 &&
                    entry.boundingClientRect.height === 0
                ){
                    setIsIntersecting(true);
                } else {
                    setIsIntersecting(entry.isIntersecting);
                }
            }),
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