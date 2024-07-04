import React from 'react';
import PropTypes from "prop-types";
import {arrayMove} from "@dnd-kit/sortable";
import {useFieldArray, useFormContext} from "react-hook-form";
import {useDispatch} from "react-redux";
import SortableList from "../../../../components/SortableList";
import OptionPage from "../index";
import {setChildrenPages} from "../../../../redux/reducers/optionPagesStateSlice";
import {useAutoAnimate} from "@formkit/auto-animate/react";

const ChildrenListView = ({parentPageIndex, pages, setActiveTab}) => {

    // manage global state
    const dispatch = useDispatch();

    // auto-animate
    const [parent] = useAutoAnimate();

    // manage form state
    const { control } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: `pages.${parentPageIndex}.children`,
    });

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = pages.findIndex((child) => child.id === active.id);
        const newIndex = pages.findIndex((child) => child.id === over.id);
        const sortedChildren = arrayMove(pages, oldIndex, newIndex);
        move(oldIndex, newIndex);

        dispatch(setChildrenPages({parentPageIndex: parentPageIndex, sortedPages: sortedChildren}));
    };

    return (
        <SortableList
            onDragEnd={handleDragEnd}
            items={pages}
        >
            <div
                className="flex-column s-24"
                ref={parent}
            >
                {pages.map((child, childIndex)=> (
                    <OptionPage
                        index={childIndex}
                        parentPageIndex={parentPageIndex}
                        parentSetActiveTab={setActiveTab}
                        key={child.id}
                        view="list"
                        page={child}
                    />
                ))}
            </div>
        </SortableList>
    );
};

ChildrenListView.propTypes = {
    setActiveTab: PropTypes.func,
    pages: PropTypes.array.isRequired,
    parentPageIndex: PropTypes.number,
};

export default ChildrenListView;