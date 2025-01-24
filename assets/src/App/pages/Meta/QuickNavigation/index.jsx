import React from "react";
import PropTypes from 'prop-types';
import QuickNavigationBox from "./QuickNavigationBox";
import {arrayMove} from "@dnd-kit/sortable";
import {setBoxes} from "../../../redux/reducers/metaStateSlice";
import SortableList from "../../../components/SortableList";
import {useFieldArray, useFormContext} from "react-hook-form";
import {useDispatch} from "react-redux";

const QuickNavigation = ({boxes}) => {

    if(typeof boxes === 'undefined' || boxes.length === 0){
        return null;
    }

    // manage global state
    const dispatch = useDispatch();

    // manage form state
    const { control } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: "boxes",
    });

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = boxes.findIndex((box) => box.id === active.id);
        const newIndex = boxes.findIndex((box) => box.id === over.id);
        const sortedBoxes = arrayMove(boxes, oldIndex, newIndex);
        move(oldIndex, newIndex);

        dispatch(setBoxes(sortedBoxes));
    };

    return (
        <React.Fragment>
            <SortableList
                onDragEnd={handleDragEnd}
                items={boxes}
            >
                <React.Fragment>
                    {boxes && boxes.map((box, index) => (
                        <QuickNavigationBox
                            index={index}
                            box={box}
                        />
                    ))}
                </React.Fragment>
            </SortableList>
        </React.Fragment>
    );
};

QuickNavigation.propTypes = {
    boxes: PropTypes.array.isRequired,
};

export default QuickNavigation;
