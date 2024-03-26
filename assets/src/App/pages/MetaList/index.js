import React, {useEffect, useRef} from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import {changeCurrentAdminMenuLink, metaTitle, refreshPage} from "../../utils/misc";
import {useDispatch, useSelector} from "react-redux";
import {fetchMeta} from "../../redux/reducers/fetchMetaSlice";
import {Link, useParams} from "react-router-dom";
import {filterByLabel} from "../../utils/objects";
import Loader from "../../components/Loader";
import ButtonLink from "../../components/ButtonLink";
import {styleVariants} from "../../constants/styles";
import Alert from "../../components/Alert";
import MetaListElement from "./MetaListElement";
import Pagination from "../../components/Pagination";
import {FormProvider, useForm, useWatch} from "react-hook-form";
import {metaTypes} from "../../../../../../advanced-custom-post-type-lite/assets/src/App/constants/metaTypes";
import {wpAjaxRequest} from "../../utils/ajax";
import {toast} from "react-hot-toast";
import BulkActions from "./BulkActions";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {scrollToTop} from "../../utils/scroll";

const MetaList = () => {

    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;
    const globals = documentGlobals.globals;

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
        }));

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
     *
     * @return {boolean}
     */
    const showBulkActions = () => {

        if(!watchedElements){
            return false;
        }

        for (const [key, value] of Object.entries(watchedElements)) {
            if(value === true){
                return true;
            }
        }

        return false;
    };

    const onSubmit = (data) => {
        methods.reset();
        data.belongsTo = metaTypes.META;
        wpAjaxRequest('bulkActionsAction', data)
            .then(res => {
                if(res.success === true){

                    // flush message
                    switch (data.action) {
                        case "delete":
                            toast.success(useTranslation("Meta group successfully deleted."));
                            methods.resetField("elements");
                            scrollToTop();

                            // refresh items
                            dispatch(fetchMeta({
                                page: page ? page : 1,
                                perPage: perPage
                            }));

                            break;
                    }
                } else {
                    toast.error(res.error);
                }
            })
            .catch(err => {
                console.error(err);
                toast.error(useTranslation("Unknown error, please retry later"));
            })
        ;
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
                    <div ref={parent}>
                        {showBulkActions() && (
                            <BulkActions />
                        )}
                    </div>
                    {data.records && data.records.length > 0 ? (
                        <div className="responsive">
                            <table className={`acpt-table with-shadow ${globals.is_rtl ? 'rtl' : ''}`}>
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
                                                    onClick={e => {
                                                        data.records.map((r) => {
                                                            methods.setValue(`elements.${r.id}`, e.currentTarget.checked);
                                                        });
                                                    }}
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
                                    {data.records && data.records.map((record) => (
                                        <MetaListElement
                                            page={page}
                                            record={record}
                                            key={record.id}
                                        />
                                    ))}
                                </tbody>
                                {totalPages > 1 && (
                                    <tfoot>
                                    <tr>
                                        <td colSpan={7}>
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
                        <Alert style={styleVariants.SECONDARY}>
                            {useTranslation("No meta group found.")} <Link to="/register_meta">{useTranslation("Register the first one")}</Link>!
                        </Alert>
                    )}
                </Layout>
            </form>
        </FormProvider>
    );
};

MetaList.propTypes = {};

export default MetaList;