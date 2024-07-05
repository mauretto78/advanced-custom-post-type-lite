import React from "react";
import PropTypes from "prop-types";
import useTranslation from "../../../hooks/useTranslation";
import SwitchView from "../../../components/SwitchView";
import SortableList from "../../../components/SortableList";
import Alert from "../../../components/Alert";
import {styleVariants} from "../../../constants/styles";
import OptionPage from "../OptionPage";
import PageSortableTab from "./PageSortableTab";
import {arrayMove} from "@dnd-kit/sortable";
import {setPages} from "../../../redux/reducers/optionPagesStateSlice";
import {useDispatch} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import BulkActions from "../BulkActions";

const TabularView = ({pages, activeTab, setActiveTab, view, setView}) => {

    // manage global state
    const dispatch = useDispatch();

    // manage form state
    const { control } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: "pages",
    });

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = pages.findIndex((page) => page.id === active.id);
        const newIndex = pages.findIndex((page) => page.id === over.id);
        const sortedPages = arrayMove(pages, oldIndex, newIndex);
        move(oldIndex, newIndex);
        setActiveTab(newIndex);

        dispatch(setPages(sortedPages));
    };

    const handleTabChange = (index) => {
        setActiveTab(index);
    };

    return (
        <React.Fragment>
            <div className="flex-between mb-24">
                <h3>
                    {useTranslation("Manage option pages")}
                </h3>
                <SwitchView
                    localStorageKey="option_page_manage_view"
                    setView={setView}
                    view={view}
                    choices={['list', 'tabular']}
                />
            </div>
            <BulkActions
                view="tab"
                setActiveTab={setActiveTab}
            />
            <div className="acpt-horizontal-tabs" data-cy="tabular-view-pages">
                {pages.length > 0 ? (
                    <React.Fragment>
                        <div className="tablist">
                            <SortableList
                                onDragEnd={handleDragEnd}
                                items={pages}
                            >
                                {pages.map((page, index) => {
                                    return (
                                        <PageSortableTab
                                            index={index}
                                            page={page}
                                            activeTab={activeTab}
                                            onClick={handleTabChange}
                                        />
                                    )
                                })}
                            </SortableList>
                        </div>
                        {pages.map((page, index) => (
                            <React.Fragment>
                                {index === activeTab && (
                                    <div className="tab-panel">
                                        <OptionPage
                                            index={index}
                                            key={page.id}
                                            view="tabular"
                                            page={page}
                                            parentSetActiveTab={setActiveTab}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                ) : (
                    <Alert style={styleVariants.WARNING}>
                        {useTranslation('No pages already created. Create the first one now by clicking the button "Add page"!')}
                    </Alert>
                )}
            </div>



        </React.Fragment>
    );
};

TabularView.propTypes = {
    activeTab: PropTypes.number.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
    setView: PropTypes.func.isRequired,
    pages: PropTypes.array.isRequired,
};

export default TabularView;