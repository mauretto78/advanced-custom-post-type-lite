import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import useTranslation from "../../../hooks/useTranslation";
import {styleVariants} from "../../../constants/styles";
import Button from "../../../components/Button";
import {
    addPage,
    deletePage,
    deselectAllElements
} from "../../../redux/reducers/optionPagesStateSlice";
import {useFormContext, useWatch} from "react-hook-form";
import PropTypes from "prop-types";
import CopyPagesModal from "../Modal/CopyPagesModal";
import {cloneChildPage, clonePage} from "../../../utils/cloners";

const BulkActions = ({view, setActiveTab}) => {

    // manage global state
    const dispatch = useDispatch();
    const {selectedElements} = useSelector(state => state.optionPagesState);

    // manage form state
    const { control, setValue, getValues } = useFormContext();
    const watchedPages = useWatch({
        control,
        name: "pages"
    });

    // manage local state
    const ref = useRef(null);
    const [action, setAction] = useState(null);
    const [copyPagesModalVisible, setCopyPagesModalVisible] = useState(false);

    const executeAction = () => {
        selectedElements.map((page) => {

            switch (action) {

                // copy
                case "copy":
                    setCopyPagesModalVisible(!copyPagesModalVisible);
                    break;

                // duplicate
                case "duplicate":

                    let duplicatedPage;

                    if(page.parentId !== null){
                        const parentPageIndex =  watchedPages.findIndex((b) => b.id === page.parentId);
                        const pageIndex =  watchedPages[parentPageIndex].children.findIndex((b) => b.id === page.id);
                        duplicatedPage = clonePage(watchedPages[parentPageIndex].children[pageIndex]);
                        watchedPages[parentPageIndex].children.push(duplicatedPage);
                    } else {
                        const pageIndex =  watchedPages.findIndex((b) => b.id === page.id);
                        duplicatedPage = clonePage(watchedPages[pageIndex]);
                        watchedPages.push(duplicatedPage);
                    }

                    dispatch(addPage({page: duplicatedPage}));
                    setValue("pages", watchedPages);

                    break;

                // delete
                case "delete":

                    if(page.parentId !== null){
                        const parentPageIndex =  watchedPages.findIndex((b) => b.id === page.parentId);
                        const pageIndex =  watchedPages[parentPageIndex].children.findIndex((b) => b.id === page.id);
                        watchedPages[parentPageIndex].children.splice(pageIndex, 1);
                        setValue("pages", watchedPages);
                    } else {
                        setValue("pages", watchedPages.filter(b => b.id !== page.id));
                    }

                    dispatch(deletePage({page: page}));

                    break;
            }
        });

        if(action === 'delete' || action === 'duplicate'){
            dispatch(deselectAllElements());
        }

        ref.current.value = "";
    };

    return (
        <React.Fragment>
            <CopyPagesModal
                modalOpen={copyPagesModalVisible}
                setModalOpen={setCopyPagesModalVisible}
            />
            {selectedElements.length > 0 && (
                <div className={`flex-between ${view === 'tab' ? 'mb-24' : ''}`}>
                    <div>
                        {selectedElements.length} {useTranslation("Selected items")}
                    </div>
                    <div className="i-flex-center s-8">
                        <select
                            ref={ref}
                            className="form-control sm"
                            onChange={e => {
                                setAction(e.target.value !== "" ? e.target.value : null);
                            }}
                        >
                            <option value="">{useTranslation("Select")}</option>
                            <option value="copy">{useTranslation("Copy")}</option>
                            <option value="duplicate">{useTranslation("Duplicate")}</option>
                            <option value="delete">{useTranslation("Delete")}</option>
                        </select>
                        <Button
                            style={styleVariants.WHITE}
                            size="sm"
                            disabled={action === null}
                            onClick={(e)=>{
                                e.preventDefault();
                                executeAction();
                            }}
                        >
                            {useTranslation("Execute")}
                        </Button>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

BulkActions.propTypes = {
    view: PropTypes.oneOf([
        "tab",
        "list"
    ]).isRequired,
    setBoxTab: PropTypes.func,
    setFieldTab: PropTypes.func,
    setBlockTab: PropTypes.func,
};

export default BulkActions;