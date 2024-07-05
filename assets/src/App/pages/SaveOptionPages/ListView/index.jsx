import React from "react";
import PropTypes from "prop-types";
import QuickNavigation from "./QuickNavigation";
import {styleVariants} from "../../../constants/styles";
import useTranslation from "../../../hooks/useTranslation";
import Alert from "../../../components/Alert";
import SortableList from "../../../components/SortableList";
import OptionPage from "../OptionPage";
import SwitchView from "../../../components/SwitchView";
import {arrayMove} from "@dnd-kit/sortable";
import {hideAll, setPages, showAll} from "../../../redux/reducers/optionPagesStateSlice";
import {useFieldArray, useFormContext} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import BulkActions from "../BulkActions";
import Button from "../../../components/Button";
import {Icon} from "@iconify/react";
import Tooltip from "../../../components/Tooltip";
import {getElementIds} from "../../../utils/fields";
import {saveCloseAll, saveShowAll} from "../../../utils/localStorage";

const ListView = ({pages, view, setView}) => {

    // manage global state
    const dispatch = useDispatch();
    const {closedElements} = useSelector(state => state.optionPagesState);

    // auto-animate
    const [parent] = useAutoAnimate();

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

        dispatch(setPages(sortedPages));
    };

    // show hide all fields handlers
    const showHideAllFields = () => {
        const ids = getElementIds(pages);
        const isClosed = closedElements.length > 0;

        if(isClosed){
            saveShowAll(ids);
            dispatch(showAll());
        } else {
            saveCloseAll(ids);
            dispatch(hideAll());
        }
    };

    return (
        <div className="container">
            <div className="col-3 flex-column s-24 hidden-xs sticky" style={{
                top: "130px"
            }}>
                <QuickNavigation pages={pages}/>
            </div>
            <div className="col-9">
                <div className="flex-between mb-24 s-8 for-xs">
                    <h3>
                        {useTranslation("Manage option pages")}
                    </h3>
                    <div className="i-flex-center s-8">
                        <Tooltip
                            label={
                                <Button
                                    css={{
                                        height: "40px"
                                    }}
                                    style={styleVariants.WHITE}
                                    size="xs"
                                    onClick={(e)=>{
                                        e.preventDefault();
                                        showHideAllFields();
                                    }}
                                >
                                    <Icon icon={closedElements.length > 0 ? 'ant-design:eye-outlined' : 'ant-design:eye-invisible-outlined'} width={18} />
                                </Button>
                            }
                            tip={useTranslation("Show/hide all pages")}
                            icon={false}
                        />
                        <SwitchView
                            localStorageKey="option_page_manage_view"
                            setView={setView}
                            view={view}
                            choices={['list', 'tabular']}
                        />
                    </div>
                </div>
                <div
                    className={pages.length > 0 ? "flex-column s-24" : ""}
                    data-cy="list-view-pages"
                    ref={parent}
                >
                    <BulkActions
                        view="list"
                    />
                    {pages.length > 0 ? (
                        <SortableList
                            onDragEnd={handleDragEnd}
                            items={pages}
                        >
                            {pages.map((page, index)=> (
                                <OptionPage
                                    index={index}
                                    key={page.id}
                                    view="list"
                                    page={page}
                                />
                            ))}
                        </SortableList>
                    ) : (
                        <Alert style={styleVariants.WARNING}>
                            {useTranslation('No options already created. Create the first one now by clicking the button "Add option"!')}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
};

ListView.propTypes = {
    view: PropTypes.string.isRequired,
    setView: PropTypes.func.isRequired,
    pages: PropTypes.array.isRequired,
};

export default ListView;