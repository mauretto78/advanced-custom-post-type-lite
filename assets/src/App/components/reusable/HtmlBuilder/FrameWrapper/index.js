import React, {useEffect, useRef} from 'react';
import {Frame} from "@craftjs/core";

const FrameWrapper = ({children, setDirtyHandler}) => {

    const ref = useRef();

    useEffect(()=>{
        observer.observe(ref.current, { attributes: true, childList: true, subtree: true });
    }, []);

    const handleMutation = (mutationRecords, observer) => {
        if(!thereAreHoverOrActiveComponentMutations(mutationRecords)  ){
            setDirtyHandler();
        }
    };

    /**
     * Check if there are hover or active components mutations
     *
     * @param mutationRecords
     * @return {boolean}
     */
    const thereAreHoverOrActiveComponentMutations = (mutationRecords) => {

        const isHoverOrActiveComponentMutation = (mutationRecord) => {
            if(typeof mutationRecord.target.className !== 'string'){
                return false;
            }

            return (mutationRecord.type === 'attributes' && mutationRecord.target.className.includes("component")  ) ;
        };

        if(mutationRecords.length < 2){
            return false;
        }

        return (isHoverOrActiveComponentMutation(mutationRecords[0]) && isHoverOrActiveComponentMutation(mutationRecords[1]));
    };

    const observer = new MutationObserver(handleMutation);

    return (
        <div ref={ref}>
            <Frame>
                {children}
            </Frame>
        </div>
    );

};

export default FrameWrapper;