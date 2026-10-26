import React, {useCallback, useEffect, useReducer} from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import {changeCurrentAdminMenuLink, metaTitle} from "../../utils/misc";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {fetchTaxonomies} from "../../redux/reducers/fetchTaxonomiesSlice";
import Loader from "../../components/Loader";
import ButtonLink from "../../components/ButtonLink";
import {styleVariants} from "../../constants/styles";
import Alert from "../../components/Alert";
import TaxonomyListElement from "./TaxonomyListElement";
import {metaTypes} from "../../constants/metaTypes";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {isElementHidden} from "../../utils/localStorage";
import {flushCookieMessages} from "../../utils/cookies";
import SyncTaxonomiesModal from "./Modal/SyncTaxonomiesModal.jsx";
import Table from "../../components/Table/index.jsx";
import {getPageSize} from "../../utils/pagination.jsx";

const TaxonomyList = () => {

    // re-render component
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    // auto-animate
    const [parent] = useAutoAnimate();

    // manage global state
    const dispatch = useDispatch();
    const {data, loading} = useSelector(state => state.fetchTaxonomies);
    const [searchParams] = useSearchParams();

    // manage local state
    const {page} = useParams();
    const perPage = getPageSize();

    const sort = searchParams.get('sort');
    const order = searchParams.get('order');
    const search = searchParams.get('search');

    const fetchData = useCallback(() => {
        dispatch(fetchTaxonomies({
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
        metaTitle(useTranslation("Registered Taxonomies"));
        changeCurrentAdminMenuLink('#/taxonomies');
    }, []);

    const actions = [
        <ButtonLink key="register-new-taxonomy" style={styleVariants.PRIMARY} size="sm" icon="bx:plus" to="/register_taxonomy">{useTranslation("Register new Taxonomy")}</ButtonLink>,
        <SyncTaxonomiesModal key="sync-taxonomies" />
    ];

    if(loading){
        return (
            <Loader/>
        );
    }

    return (
        <Layout
            title={useTranslation("Registered Taxonomies")}
            actions={actions}
            crumbs={[
                {
                    label: useTranslation("Registered Taxonomies")
                }
            ]}
        >
            <Table
                rowKey="slug"
                isSelectable={r => !r.isNative}
                belongsTo={metaTypes.TAXONOMY}
                columns={[
                    {
                        key: "slug",
                        cell: <span>{useTranslation("Slug")}</span>,
                        sortable: true
                    },
                    {
                        key: "type",
                        cell: <span>{useTranslation("Type")}</span>,
                        sortable: false
                    },
                    {
                        key: "associated_post_types",
                        cell: <span>{useTranslation("Associated post types")}</span>,
                        sortable: false
                    },
                    {
                        key: "field_groups",
                        cell: <span>{useTranslation("Field groups")}</span>,
                        sortable: false
                    },
                    {
                        key: "actions",
                        cell: <span>{useTranslation("Actions")}</span>,
                        sortable: false
                    },
                ]}
                page={page ? parseInt(page) : 1}
                total={data.count ?? 0}
                data={data.records ?? []}
                baseLink="/taxonomies"
                forceUpdate={forceUpdate}
                noRecordsElement={
                    <Alert style={styleVariants.SECONDARY}>
                        {useTranslation("No taxonomies found.")} <Link to="/register_taxonomy">{useTranslation("Register the first one")}</Link>!
                    </Alert>
                }
                renderRow={(record, {handleSelect}) => {
                    if(!isElementHidden(record.slug, metaTypes.TAXONOMY)){
                        return (
                            <TaxonomyListElement
                                handleSelect={handleSelect}
                                key={record.id}
                                record={record}
                                page={page ? parseInt(page) : 1}
                                perPage={perPage}
                            />
                        );
                    }
                    return null;
                }}
            />
        </Layout>
    );
};

export default TaxonomyList;