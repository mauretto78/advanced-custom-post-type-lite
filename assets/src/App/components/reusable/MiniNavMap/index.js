import React, {useEffect, useState} from 'react';
import MiniNavMapElement from "./MiniNavMapElement";

const MiniNavMap = ({values}) => {

    // manage local state
    const [isActiveId, setActiveId] = useState(null);

    if(values.length === 0){
        return null;
    }

    // scroll handling
    useEffect(() => {

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach((entry)=>{
                if(entry.isIntersecting === true){
                    setActiveId(entry.target.id);
                }
            });
        }, { threshold: [1] });

        values.map((value)=>{
            if(document.getElementById(value.id)){
                observer.observe(document.getElementById(value.id));

                value.fields && value.fields.map((field)=>{
                    if(document.getElementById(field.id)){
                        observer.observe(document.getElementById(field.id));
                    }
                });
            }
        });

    }, []);

    return (
        <div className="acpt-mini-map">
            <h4>Quick navigation</h4>
            {values.map((value, index) => (
                <MiniNavMapElement
                    value={value}
                    key={index}
                    isActiveId={isActiveId}
                    setActiveId={setActiveId}
                />
            ))}
        </div>
    );
};

export default MiniNavMap;