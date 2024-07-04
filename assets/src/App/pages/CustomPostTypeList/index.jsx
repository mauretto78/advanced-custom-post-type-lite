import React, {useEffect, useRef} from 'react';
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
import BulkActions from "./BulkActions";
import {wpAjaxRequest} from "../../utils/ajax";
import {metaTypes} from "../../constants/metaTypes";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {scrollToTop} from "../../utils/scroll";
import SyncPostsModal from "./Modal/SyncPostsModal";

const CustomPostTypeList = () => {

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
    const {data, loading} = useSelector(state => state.fetchCustomPostTypes);

    // manage local state
    const {page} = useParams();
    const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
    const totalPages = Math.ceil( data.count / perPage );

    useEffect(() => {
        metaTitle(useTranslation("Registered Custom Post Types"));
        dispatch(fetchCustomPostTypes({
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
        data.belongsTo = metaTypes.CUSTOM_POST_TYPE;

        wpAjaxRequest('bulkActionsAction', data)
            .then(res => {
                if(res.success === true){

                    // flush message
                    switch (data.action) {
                        case "delete":
                            toast.success(useTranslation("Custom post type successfully deleted. The browser will refresh after 5 seconds."));
                            methods.resetField("elements");
                            scrollToTop();

                            // refresh items
                            dispatch(fetchCustomPostTypes({
                                page: page ? page : 1,
                                perPage: perPage
                            }));

                            refreshPage(5000);
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
                    <div ref={parent}>
                        {showBulkActions() && (
                            <BulkActions />
                        )}
                    </div>
                    {data.records && data.records.length > 0 ? (
                        <div className="responsive">
                            <table
                                data-cy="cpt-table"
                                className={`acpt-table with-shadow ${globals.is_rtl ? 'rtl' : ''}`}
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
                                                    onClick={e => {
                                                        data.records.filter(r => r.isNative === false).map((r) => {
                                                            methods.setValue(`elements.${r.name}`, e.currentTarget.checked);
                                                        });
                                                    }}
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
                                    {data.records && data.records.map((record) => (
                                        <CustomPostTypeElement
                                            key={record.id}
                                            record={record}
                                            showWooCommerceColumn={showWooCommerceColumn()}
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

CustomPostTypeList.propTypes = {};

export default CustomPostTypeList;