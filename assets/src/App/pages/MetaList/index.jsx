import React, {useEffect, useReducer, useRef} from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import {changeCurrentAdminMenuLink, metaTitle, refreshPage} from "../../utils/misc";
import {useDispatch, useSelector} from "react-redux";
import {fetchMeta} from "../../redux/reducers/fetchMetaSlice";
import {useParams} from "react-router-dom";
import {filterByLabel} from "../../utils/objects";
import Loader from "../../components/Loader";
import ButtonLink from "../../components/ButtonLink";
import {styleVariants} from "../../constants/styles";
import MetaListElement from "./MetaListElement";
import Pagination from "../../components/Pagination";
import {FormProvider, useForm, useWatch} from "react-hook-form";
import {metaTypes} from "../../constants/metaTypes";
import {wpAjaxRequest} from "../../utils/ajax";
import {toast} from "react-hot-toast";
import BulkActions from "../../components/BulkActions";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {scrollToTop} from "../../utils/scroll";
import {hiddenElements, hideElements, isElementHidden} from "../../utils/localStorage";
import {flushCookieMessages, setCookieMessage} from "../../utils/cookies";

const MetaList = () => {

    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;
    const globals = documentGlobals.globals;

    const hiddenElms = hiddenElements(metaTypes.CUSTOM_POST_TYPE);

    // re-render component
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    // auto-animate
    const [parent] = useAutoAnimate();

    // ref
    const ref = useRef();

    // form init
    const methods = useForm({
        mode: 'all'
    });

    const watchedElements = useWatch({
        control: methods.control,
        name: "elements"
    });

    // manage global state
    const dispatch = useDispatch();
    const {data, loading} = useSelector(state => state.fetchMeta);

    // manage local state
    const {page} = useParams();
    const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
    const totalPages = Math.ceil( data.count / perPage );

    useEffect(() => {
        metaTitle(useTranslation("Field groups"));
        changeCurrentAdminMenuLink('#/meta');
        dispatch(fetchMeta({
            page: page ? page : 1,
            perPage: perPage
        })).then(res => {
            flushCookieMessages();
        });

    }, [page]);

    useEffect(() => {

        /**
         *
         * @return {boolean}
         */
        const areAllSelected = () => {

            if(!watchedElements){
                return false;
            }

            let matches = 0;
            for (const [key, value] of Object.entries(watchedElements)) {
                if(value === true){
                    matches++;
                }
            }

            return matches === Object.entries(watchedElements).length;
        };

        if(areAllSelected()){
            ref.current.checked = true;
        } else {
            if(ref.current){
                ref.current.checked = false;
            }
        }

    }, [watchedElements]);

    /**
     * re-render the app when hidden elements are restored
     */
    document.addEventListener("restoredElement", function(){
        forceUpdate();
    });

    const onSubmit = (data) => {
        methods.reset();
        data.belongsTo = metaTypes.META;
        const action = data.action;

        if(!action){
            return;
        }

        switch(action){
            // hide elements
            case "hide":
                hideElements(data);
                break;

            // delete elements
            // duplicate elements
            case "delete":
            case "duplicate":
                wpAjaxRequest('bulkActionsAction', data)
                    .then(res => {
                        if(res.success === true){

                            // flush message
                            switch (data.action) {
                                case "delete":
                                    setCookieMessage("Meta group successfully deleted.");
                                    break;

                                case "duplicate":
                                    setCookieMessage("Meta group successfully duplicated.");
                                    break;
                            }

                            methods.resetField("elements");
                            scrollToTop();
                            refreshPage();
                        } else {
                            toast.error(res.error);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        toast.error(useTranslation("Unknown error, please retry later"));
                    })
                ;
                break;
        }
    };

    const handleSelectAll = (checked) => {
        data.records
            .filter(r => !isElementHidden(r.id, metaTypes.META))
            .map((r) => {
            methods.setValue(`elements.${r.id}`, checked);
        });
    };

    const actions = [
        <ButtonLink style={styleVariants.PRIMARY} to="/register_meta">
            {useTranslation("Create new Meta group")}
        </ButtonLink>,
    ];

    if(loading){
        return (
            <Loader/>
        );
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Layout
                    title={useTranslation("Field groups")}
                    actions={actions}
                    crumbs={[
                        {
                            label: useTranslation("Field groups")
                        }
                    ]}
                >
                    <BulkActions belongsTo={metaTypes.META} />
                    {data.records && data.records.length > 0 ? (
                        <div className="responsive with-shadow b-rounded">
                            <table className={`acpt-table ${globals.is_rtl ? 'rtl' : ''}`}>
                                <thead>
                                    <tr>
                                        <th style={{
                                            width: "24px"
                                        }}>
                                            <label className="checkbox" htmlFor="all">
                                                <input
                                                    ref={ref}
                                                    type="checkbox"
                                                    id="all"
                                                    defaultChecked={false}
                                                    onClick={e => handleSelectAll(e.currentTarget.checked)}
                                                />
                                                <span/>
                                            </label>
                                        </th>
                                        <th>
                                            {useTranslation("Group name")}
                                        </th>
                                        <th>
                                            {useTranslation("Group label")}
                                        </th>
                                        <th>
                                            {useTranslation("Display as")}
                                        </th>
                                        <th>
                                            {useTranslation("Context")}
                                        </th>
                                        <th>
                                            {useTranslation("Priority")}
                                        </th>
                                        <th>
                                            {useTranslation("Location")}
                                        </th>
                                        <th>
                                            {useTranslation("Fields count")}
                                        </th>
                                        <th>
                                            {useTranslation("Actions")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.records && data.records.map((record) => {
                                        if(!isElementHidden(record.id, metaTypes.META)){
                                            return (
                                                <MetaListElement
                                                    page={page}
                                                    record={record}
                                                    key={record.id}
                                                />
                                            );
                                        }
                                    })}
                                </tbody>
                                {totalPages > 1 && (
                                    <tfoot>
                                    <tr>
                                        <td colSpan={9}>
                                            <Pagination
                                                currentPage={page ? parseInt(page) : 1}
                                                totalPages={totalPages}
                                                baseLink="/meta"
                                            />
                                        </td>
                                    </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    ) : (
                        <div className="p-24 bg-white with-shadow">
                            <div className="b-maxi b-rounded p-24 flex-column s-12 text-center">
                                <span>
                                    {useTranslation('No meta group found.')}
                                </span>
                                <div>
                                    <ButtonLink
                                        type="button"
                                        style={styleVariants.SECONDARY}
                                        to="/register_meta"
                                    >
                                        {useTranslation("Create new Meta group")}
                                    </ButtonLink>
                                </div>
                            </div>
                        </div>
                    )}
                </Layout>
            </form>
        </FormProvider>
    );
};

MetaList.propTypes = {};

export default MetaList;