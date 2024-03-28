import React, {useState} from "react";
import PropTypes from 'prop-types';
import QuickNavigationField from "./QuickNavigationField";
import {Icon} from "@iconify/react";
import {useFormContext, useWatch} from "react-hook-form";
import {scrollToId} from "../../../../utils/scroll";

const QuickNavigationBox = ({index, box}) => {

    const { control } = useFormContext();
    const watchedBoxName = useWatch({
        control,
        name: `boxes.${index}.name`
    });

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    const [isClosed, setIsClosed] = useState(false);

    return (
        <div key={box.id} className="b-rounded with-shadow bg-white p-24">
            <h3 className={`${(!isClosed && box.fields.length > 0) ? 'mb-24' : ''} flex-between s-8`}>
                <span className="cursor-pointer top-2" onClick={() => setIsClosed(!isClosed)}>
                    <Icon width={18} icon={!isClosed ? 'bx:chevron-down' : 'bx:chevron-up'} color="#777" />
                </span>
                <span
                    className="text-ellipsis cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToId(box.id);
                    }}
                >
                    {watchedBoxName ? watchedBoxName : box.name}
                </span>
            </h3>
            {!isClosed && box.fields && box.fields.length > 0 && (
                <div className={`tree ${globals.is_rtl === true ? `rtl` : ``}`}>
                    {box.fields.map((field, fieldIndex) => (
                       <React.Fragment>
                           <QuickNavigationField
                               level={0}
                               boxIndex={index}
                               fieldIndex={fieldIndex}
                               boxId={box.id}
                               field={field}
                           />
                       </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

QuickNavigationBox.propTypes = {
    index: PropTypes.number.isRequired,
    box: PropTypes.object.isRequired,
};

export default QuickNavigationBox;