import React, {useEffect, useReducer, useRef} from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import {useDispatch, useSelector} from "react-redux";
import {fetchCustomPostTypes} from "../../redux/reducers/fetchCustomPostTypesSlice";
import {metaTitle, refreshPage} from "../../utils/misc";
import Loader from "../../components/Loader";
import {Link, useParams} from "react-router-dom";
import Alert from "../../components/Alert";
import {styleVariants} from "../../constants/styles";
import Tooltip from "../../components/Tooltip";
import CustomPostTypeElement from "./CustomPostTypeElement";
import {filterByLabel} from "../../utils/objects";
import Pagination from "../../components/Pagination";
import ButtonLink from "../../components/ButtonLink";
import {toast} from "react-hot-toast";
import {FormProvider, useForm, useWatch} from "react-hook-form";
import {wpAjaxRequest} from "../../utils/ajax";
import {metaTypes} from "../../constants/metaTypes";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {scrollToTop} from "../../utils/scroll";
import SyncPostsModal from "./Modal/SyncPostsModal";
import BulkActions from "../../components/BulkActions";
import {hideElements, isElementHidden} from "../../utils/localStorage";
import {flushCookieMessages, setCookieMessage} from "../../utils/cookies";

const CustomPostTypeList = () => {

    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;
    const globals = documentGlobals.globals;

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
    const {data, loading} = useSelector(state => state.fetchCustomPostTypes);

    // manage local state
    const {page} = useParams();
    const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
    const totalPages = Math.ceil( data.count / perPage );

    /**
     * init
     */
    useEffect(() => {
        metaTitle(useTranslation("Registered Custom Post Types"));
        dispatch(fetchCustomPostTypes({
            page: page ? page : 1,
            perPage: perPage
        })).then(res => {
            flushCookieMessages();
        });
    }, [page]);

    /**
     * toggle select all
     */
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
        data.belongsTo = metaTypes.CUSTOM_POST_TYPE;
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
                            switch (action) {
                                case "delete":
                                    setCookieMessage("Custom post type successfully deleted.");
                                    break;

                                case "duplicate":
                                    setCookieMessage("Custom post type successfully duplicated.");
                                    break;
                            }

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

        methods.resetField("elements");
    };

    /**
     *
     * @return {boolean}
     */
    const showWooCommerceColumn = () => {

        if(!data.records){
            return false;
        }

        let match = 0;

        data.records.map((r) => {
            if(r.isWooCommerce === true){
                match++;
            }
        });

        return match > 0;
    };

    const handleSelectAll = (checked) => {
        data.records
            .filter(r => r.isNative === false)
            .filter(r => !isElementHidden(r.name, metaTypes.CUSTOM_POST_TYPE))
            .map((r) => {
                methods.setValue(`elements.${r.name}`, checked);
        });
    };

    const actions = [
        <ButtonLink style={styleVariants.PRIMARY} to="/register">
            {useTranslation("Register new Post Type")}
        </ButtonLink>,
        <SyncPostsModal />
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
                    title={useTranslation("Registered Custom Post Types")}
                    actions={actions}
                    crumbs={[
                        {
                            label: useTranslation("Registered Custom Post Types"),
                        }
                    ]}
                >
                    <BulkActions belongsTo={metaTypes.CUSTOM_POST_TYPE} />
                    {data.records && data.records.length > 0 ? (
                        <div className="responsive with-shadow b-rounded">
                            <table
                                data-cy="cpt-table"
                                className={`acpt-table ${globals.is_rtl ? 'rtl' : ''}`}
                            >
                                <thead>
                                    <tr>
                                        <th style={{
                                            width: "24px"
                                        }}>
                                            <label
                                                data-cy="select-all"
                                                className="checkbox"
                                                htmlFor="all"
                                            >
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
                                        <th/>
                                        <th>
                                            {useTranslation("Name")}
                                        </th>
                                        <th>
                                            {useTranslation("Type")}
                                        </th>
                                        <th>
                                            <Tooltip
                                                tip={useTranslation("Associated taxonomies with the post")}
                                                label={useTranslation("Associated taxonomies")}
                                            />
                                        </th>
                                        {showWooCommerceColumn() && (
                                            <th>
                                                <Tooltip
                                                    tip={useTranslation("Associated WooCommerce product data")}
                                                    label={useTranslation("Product data")}
                                                />
                                            </th>
                                        )}
                                        <th>
                                            {useTranslation("Field groups")}
                                        </th>
                                        <th>
                                            {useTranslation("Actions")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.records && data.records.map((record) => {
                                        if(!isElementHidden(record.name, metaTypes.CUSTOM_POST_TYPE)){
                                            return (
                                                <CustomPostTypeElement
                                                    key={record.id}
                                                    record={record}
                                                    page={page}
                                                    perPage={perPage}
                                                    showWooCommerceColumn={showWooCommerceColumn()}
                                                />
                                            );
                                        }
                                    })}
                                </tbody>
                                {totalPages > 1 && (
                                    <tfoot>
                                    <tr>
                                        <td colSpan={showWooCommerceColumn() ? 8 : 7}>
                                            <Pagination
                                                currentPage={page ? parseInt(page) : 1}
                                                totalPages={totalPages}
                                                baseLink=""
                                            />
                                        </td>
                                    </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    ) : (
                        <Alert style={styleVariants.SECONDARY}>
                            {useTranslation("No custom post types found.")} <Link to="/register">{useTranslation("Register the first one")}</Link>!
                        </Alert>
                    )}
                </Layout>
            </form>
        </FormProvider>
    );
};

export default CustomPostTypeList;