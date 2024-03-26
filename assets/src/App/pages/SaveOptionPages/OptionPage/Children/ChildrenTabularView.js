import React from 'react';
import PropTypes from "prop-types";
import {arrayMove} from "@dnd-kit/sortable";
import {useFieldArray, useFormContext} from "react-hook-form";
import {useDispatch} from "react-redux";
import SortableList from "../../../../components/SortableList";
import OptionPage from "../index";
import {addPage, setChildrenPages} from "../../../../redux/reducers/optionPagesStateSlice";
import ChildrenTabularTabElement from "./ChildrenTabularTabElement";
import {styleVariants} from "../../../../constants/styles";
import Button from "../../../../components/Button";
import {v4 as uuidv4} from "uuid";
import {delay} from "../../../../utils/misc";
import {scrollToId} from "../../../../utils/scroll";

const ChildrenTabularView = ({parentPageId, parentPageIndex, pages, activeTab, setActiveTab}) => {

    // manage global state
    const dispatch = useDispatch();

    // manage form state
    const { control } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: `pages.${parentPageIndex}.children`,
    });

    const handleAddChildPage = () => {

        const newPageId = uuidv4();
        const newPage = {
            id: newPageId,
            pageTitle: 'New option child page',
            menuTitle: 'Menu child title',
            menuSlug: 'menu_child_slug',
            icon: null,
            position: 99,
            description: null,
            parentId: parentPageId,
            capability: ["manage_options"],
            children: [],
            isSaved: false,
        };

        dispatch(addPage({page: newPage}));
        setActiveTab(pages.length);

        delay(1).then(()=>{
            scrollToId(newPage.id);
        });
    };

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = pages.findIndex((child) => child.id === active.id);
        const newIndex = pages.findIndex((child) => child.id === over.id);
        const sortedChildren = arrayMove(pages, oldIndex, newIndex);
        move(oldIndex, newIndex);
        setActiveTab(newIndex);

        dispatch(setChildrenPages({parentPageIndex: parentPageIndex, sortedPages: sortedChildren}));
    };

    return (
        <React.Fragment>
            <div
                className="flex-wrap i-flex-center s-8 mb-12"
            >
                <SortableList
                    items={pages}
                    onDragEnd={handleDragEnd}
                    mode="horizontal"
                >
                    {pages && pages.map((child, childIndex) => (
                        <ChildrenTabularTabElement
                            index={childIndex}
                            parentPageIndex={parentPageIndex}
                            isActive={childIndex === activeTab}
                            page={child}
                            onClick={setActiveTab}
                        />
                    ))}
                </SortableList>
                <Button
                    type="button"
                    style={styleVariants.SECONDARY}
                    size="sm"
                    onClick={e => {
                        e.preventDefault();
                        handleAddChildPage();
                    }}
                >
                    +
                </Button>
            </div>
            {pages.map((child, childIndex) => (
                <React.Fragment>
                    {childIndex === activeTab && (
                        <div className="tab-panel">
                            <OptionPage
                                index={childIndex}
                                parentPageIndex={parentPageIndex}
                                key={child.id}
                                view="tabular"
                                page={child}
                                parentSetActiveTab={setActiveTab}
                            />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </React.Fragment>
    );
};

ChildrenTabularView.propTypes = {
    activeTab: PropTypes.number.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    pages: PropTypes.array.isRequired,
    parentPageIndex: PropTypes.number,
};

export default ChildrenTabularView;