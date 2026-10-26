import React, {useCallback, useEffect, useReducer} from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import {useDispatch, useSelector} from "react-redux";
import {fetchCustomPostTypes} from "../../redux/reducers/fetchCustomPostTypesSlice";
import {changeCurrentAdminMenuLink, metaTitle} from "../../utils/misc";
import Loader from "../../components/Loader";
import {Link, useParams, useSearchParams} from "react-router-dom";
import Alert from "../../components/Alert";
import {styleVariants} from "../../constants/styles";
import CustomPostTypeElement from "./CustomPostTypeElement";
import ButtonLink from "../../components/ButtonLink";
import {metaTypes} from "../../constants/metaTypes";
import SyncPostsModal from "./Modal/SyncPostsModal";
import {isElementHidden} from "../../utils/localStorage";
import {flushCookieMessages} from "../../utils/cookies";
import Table from "../../components/Table/index.jsx";
import {getPageSize} from "../../utils/pagination.jsx";

const CustomPostTypeList = () => {

    // re-render component
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    // manage global state
    const dispatch = useDispatch();
    const {data, loading} = useSelector(state => state.fetchCustomPostTypes);
    const [searchParams] = useSearchParams();

    // manage local state
    const {page} = useParams();
    const perPage = getPageSize();

    const sort = searchParams.get('sort');
    const order = searchParams.get('order');
    const search = searchParams.get('search');

    const fetchData = useCallback(() => {
        dispatch(fetchCustomPostTypes({
            page: page ? page : 1,
            perPage: perPage,
            sort: sort ?? null,
            order: order ?? null,
            search: search ?? null,
        })).then(res => {
            flushCookieMessages();
        });
    }, [dispatch, page, perPage, sort, order, search]);

    useEffect(() => {
        fetchData();
    }, [fetchData, sort, order, search]);

    useEffect(() => {
        metaTitle(useTranslation("Registered Custom Post Types"));
        changeCurrentAdminMenuLink("");
    }, []);

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
        <ButtonLink key="register-post-type" testId="register-post-type" style={styleVariants.PRIMARY} size="sm" icon="bx:plus" to="/register">
            {useTranslation("Register new Post Type")}
        </ButtonLink>,
        <SyncPostsModal key="sync-posts" />
    ];

    if(loading){
        return (
            <Loader/>
        );
    }

    const columns = [
        {
            key: "",
            cell: <span />,
            sortable: false
        },
        {
            key: "name",
            cell: <span>{useTranslation("Name")}</span>,
            sortable: true
        },
        {
            key: "type",
            cell: <span>{useTranslation("Type")}</span>,
            sortable: false
        },
        {
            key: "associated_taxonomies",
            cell: <span>{useTranslation("Associated taxonomies")}</span>,
            sortable: false
        }
    ];

    if (showWooCommerceColumn()) {
        columns.push({
            key: "product_data",
            cell: <span>{useTranslation("Product data")}</span>,
            sortable: false
        });
    }

    columns.push({
        key: "field_groups",
        cell: <span>{useTranslation("Field groups")}</span>,
        sortable: false
    });

    columns.push({
        key: "actions",
        cell: <span>{useTranslation("Actions")}</span>,
        sortable: false
    });

    return (
        <Layout
            title={useTranslation("Registered Custom Post Types")}
            actions={actions}
            crumbs={[
                {
                    label: useTranslation("Registered Custom Post Types"),
                }
            ]}
        >
            <Table
                rowKey="name"
                isSelectable={r => !r.isNative}
                belongsTo={metaTypes.CUSTOM_POST_TYPE}
                columns={columns}
                page={page ? parseInt(page) : 1}
                total={data.count ?? 0}
                data={data.records ?? []}
                baseLink=""
                forceUpdate={forceUpdate}
                noRecordsElement={
                    <Alert style={styleVariants.SECONDARY}>
                        {useTranslation("No custom post types found.")} <Link to="/register">{useTranslation("Register the first one")}</Link>!
                    </Alert>
                }
                renderRow={(record, {handleSelect}) => {
                    if(!isElementHidden(record.name, metaTypes.CUSTOM_POST_TYPE)){
                        return (
                            <CustomPostTypeElement
                                handleSelect={handleSelect}
                                key={record.id}
                                record={record}
                                page={page ? parseInt(page) : 1}
                                perPage={perPage}
                                showWooCommerceColumn={showWooCommerceColumn()}
                            />
                        );
                    }
                    return null;
                }}
            />
        </Layout>
    );
};

export default CustomPostTypeList;