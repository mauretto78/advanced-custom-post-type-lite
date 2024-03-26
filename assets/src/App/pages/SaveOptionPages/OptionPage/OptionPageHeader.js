import React, {useState} from 'react';
import PropTypes from "prop-types";
import {get, useFormContext, useWatch} from "react-hook-form";
import {Icon} from "@iconify/react";
import useTranslation from "../../../hooks/useTranslation";
import Tooltip from "../../../components/Tooltip";
import {saveIsClosed} from "../../../utils/localStorage";
import {addPage, hideElement, showElement} from "../../../redux/reducers/optionPagesStateSlice";
import {useDispatch, useSelector} from "react-redux";
import DeletePageModal from "../Modal/DeletePageModal";
import {cloneChildPage, clonePage} from "../../../utils/cloners";
import {delay} from "../../../utils/misc";
import {scrollToId} from "../../../utils/scroll";
import CopyPageModal from "../Modal/CopyPageModal";
import ElementSelector from "../BulkActions/ElementSelector";

const OptionPageHeader = ({page, view, listeners, attributes, index, parentPageIndex, formId, parentSetActiveTab}) => {

    // manage form state
    const { formState: {errors}, control } = useFormContext();
    const watchedName = useWatch({
        control,
        name: formId("menuTitle")
    });

    const watchedPage = useWatch({
        control,
        name: formId()
    });

    // manage global state
    const dispatch = useDispatch();
    const {closedElements} = useSelector(state => state.optionPagesState);

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === page.id);

        return filter.length === 1;
    };

    /**
     *
     * @return {boolean}
     */
    const isPageSaved = () => {

        if(typeof page.isSaved !== 'undefined' && page.isSaved === false){
            return false
        }

        return true;
    };

    /**
     *
     * @return {string|*}
     */
    const name = () => {
        const id = formId("menuSlug");
        const error = get(errors, id);

        if(error){
            return (
                <span className="invalid-feedback">
                    {useTranslation(error.message)}
                </span>
            );
        }

        return watchedName ? watchedName : page.menuTitle;
    };

    /**
     * Toggle close box
     */
    const handleToggleClose = () => {
        saveIsClosed(page.id);

        if((isClosed())){
            dispatch(showElement({id: page.id}));
        } else {
            dispatch(hideElement({id: page.id}));
        }
    };

    return (
        <div className="flex-between s-8 for-xs">
            <span className="i-flex-center s-8">
                {view === 'list' && (
                    <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                        <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                    </span>
                )}
                <ElementSelector
                    element={page}
                />
                <h3>
                    {name()}
                </h3>
            </span>
            <span className="i-flex-center s-8">
                {isPageSaved() && (
                    <React.Fragment>
                        <Tooltip
                            label={
                                <a
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        let duplicatedPage;

                                        if(page.parentId !== null){
                                            duplicatedPage = cloneChildPage(page.parentId, watchedPage);
                                            parentSetActiveTab(page.children.length);
                                        } else {
                                            duplicatedPage = clonePage(watchedPage);
                                        }

                                        dispatch(addPage({page: duplicatedPage}));

                                        delay(1).then(()=>{
                                            scrollToId(duplicatedPage.id);
                                        });
                                    }}
                                >
                                    <Icon icon="bx:duplicate" width={18} />
                                </a>
                            }
                            tip={useTranslation("Duplicate this option page")}
                            icon={false}
                        />
                        {page.parentId && (
                            <Tooltip
                                label={
                                    <CopyPageModal
                                        parentId={page.parentId}
                                        index={index}
                                        parentPageIndex={parentPageIndex}
                                        parentSetActiveTab={parentSetActiveTab}
                                        page={page}
                                    />
                                }
                                tip={useTranslation("Copy this option page")}
                                icon={false}
                            />
                        )}
                        <Tooltip
                            label={
                                <DeletePageModal
                                    index={index}
                                    parentPageIndex={parentPageIndex}
                                    parentSetActiveTab={parentSetActiveTab}
                                    page={page}
                                />
                            }
                            tip={useTranslation("Delete this option page")}
                            icon={false}
                        />
                    </React.Fragment>
                )}
                {view === 'list' && (
                    <Tooltip
                        label={
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    handleToggleClose();
                                }}
                            >
                                <Icon icon="bx:expand-alt" width={18} />
                            </a>
                        }
                        tip={useTranslation("Hide/show this page")}
                        icon={false}
                    />
                )}
            </span>
        </div>
    );
};

OptionPageHeader.propTypes = {
    index: PropTypes.number.isRequired,
    parentPageIndex: PropTypes.number,
    page: PropTypes.object.isRequired,
    parentSetActiveTab: PropTypes.func,
    listeners: PropTypes.func,
    attributes: PropTypes.func,
    formId: PropTypes.func.isRequired,
    view: PropTypes.oneOf([
        "list",
        "tabular"
    ]).isRequired,
};

export default OptionPageHeader;