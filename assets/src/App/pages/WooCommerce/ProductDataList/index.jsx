import React, {useEffect, useReducer, useRef} from 'react';
import useTranslation from "../../../hooks/useTranslation";
import Layout from "../../../layout/Layout";
import {styleVariants} from "../../../constants/styles";
import ButtonLink from "../../../components/ButtonLink";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {filterByLabel} from "../../../utils/objects";
import Loader from "../../../components/Loader";
import {metaTitle, refreshPage} from "../../../utils/misc";
import {fetchWooCommerceProductData} from "../../../redux/reducers/fetchWooCommerceProductDataSlice";
import Alert from "../../../components/Alert";
import Pagination from "../../../components/Pagination";
import ProductDataListElement from "./ProductDataListElement";
import {FormProvider, useForm, useWatch} from "react-hook-form";
import {wpAjaxRequest} from "../../../utils/ajax";
import {toast} from "react-hot-toast";
import {scrollToTop} from "../../../utils/scroll";
import BulkActions from "../../../components/BulkActions";
import {hideElements, isElementHidden} from "../../../utils/localStorage";
import {flushCookieMessages, setCookieMessage} from "../../../utils/cookies";

const ProductDataList = ({}) => {

    const globals = document.globals;
    const settings = globals.settings;

    // re-render component
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

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
    const {data, loading} = useSelector(state => state.fetchWooCommerceProductData);

    // manage local state
    const {page} = useParams();
    const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
    const totalPages = Math.ceil( data.count / perPage );

    useEffect(() => {
        metaTitle(useTranslation("WooCommerce product data"));
        dispatch(fetchWooCommerceProductData({
            page: page ? page : 1,
            perPage: perPage
        })).then(res => {
            flushCookieMessages();
        });
    }, [page]);

    const actions = [
        <ButtonLink
            to="/product-data/product/add"
            style={styleVariants.PRIMARY}
        >
            {useTranslation("Add product data")}
        </ButtonLink>
    ];

    const handleSelectAll = (checked) => {
        data.records
            .filter(r => !isElementHidden(r.id, "woo_product_data"))
            .map((r) => {
                methods.setValue(`elements.${r.id}`, checked);
            });
    };

    /**
     * re-render the app when hidden elements are restored
     */
    document.addEventListener("restoredElement", function(){
        forceUpdate();
    });

    /**
     *
     * @param data
     */
    const onSubmit = (data) => {
        methods.reset();
        data.belongsTo = "woo_product_data";
        const action = data.action;

        if(!action){
            return;
        }

        switch(action) {
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
                                    setCookieMessage("WooCommerce product data successfully deleted");
                                    break;

                                case "duplicate":
                                    setCookieMessage("WooCommerce product data successfully duplicated");
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
        }
    };

    if(loading){
        return (
            <Loader/>
        );
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Layout
                    title={useTranslation("WooCommerce product data")}
                    actions={actions}
                    crumbs={[
                        {
                            label: useTranslation("Registered Custom Post Types"),
                            link: "/"
                        },
                        {
                            label: useTranslation("WooCommerce product data")
                        }
                    ]}
                >
                    <BulkActions belongsTo="woo_product_data" />
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
                                                    onClick={e => {
                                                        data.records.map((r) => handleSelectAll(e.currentTarget.checked));
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
                                            {useTranslation("Show on UI")}
                                        </th>
                                        <th>
                                            {useTranslation("Visibility")}
                                        </th>
                                        <th>
                                            {useTranslation("Fields")}
                                        </th>
                                        <th>
                                            {useTranslation("Actions")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.records && data.records.map((record) => {
                                        if(!isElementHidden(record.id, "woo_product_data")){
                                            return (
                                                <ProductDataListElement
                                                    key={record.id}
                                                    record={record}
                                                    page={page ? page : 1}
                                                    perPage={perPage}
                                                />
                                            );
                                        }
                                    })}
                                </tbody>
                                {totalPages > 1 && (
                                    <tfoot>
                                        <tr>
                                            <td colSpan={6}>
                                                <Pagination
                                                    currentPage={page ? parseInt(page) : 1}
                                                    totalPages={totalPages}
                                                    baseLink="/product-data/product"
                                                />
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    ) : (
                        <Alert style={styleVariants.SECONDARY}>
                            {useTranslation("No product data found.")} <Link to="/product-data/product/add">{useTranslation("Register the first one")}</Link>!
                        </Alert>
                    )}
                </Layout>
            </form>
        </FormProvider>
    );
};

export default ProductDataList;