import React, {useCallback, useEffect, useReducer} from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import {changeCurrentAdminMenuLink, metaTitle} from "../../utils/misc";
import {useDispatch, useSelector} from "react-redux";
import {fetchMeta} from "../../redux/reducers/fetchMetaSlice";
import {useParams, useSearchParams} from "react-router-dom";
import Loader from "../../components/Loader";
import ButtonLink from "../../components/ButtonLink";
import {styleVariants} from "../../constants/styles";
import MetaListElement from "./MetaListElement";
import {metaTypes} from "../../constants/metaTypes";
import {isElementHidden} from "../../utils/localStorage";
import {flushCookieMessages} from "../../utils/cookies";
import Table from "../../components/Table/index.jsx";
import {getPageSize} from "../../utils/pagination.jsx";

const MetaList = () => {

    // re-render component
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    // manage global state
    const dispatch = useDispatch();
    const {data, loading} = useSelector(state => state.fetchMeta);
    const [searchParams] = useSearchParams();

    // manage local state
    const {page} = useParams();
    const perPage = getPageSize();

    const sort = searchParams.get('sort');
    const order = searchParams.get('order');
    const search = searchParams.get('search');

    const fetchData = useCallback(() => {
        dispatch(fetchMeta({
            page: page ? page : 1,
            perPage: perPage,
            cct: false,
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
        metaTitle(useTranslation("Field groups"));
        changeCurrentAdminMenuLink('#/meta');
    }, []);

    const actions = [
        <ButtonLink key="create-meta-group" testId="create-meta-group" style={styleVariants.PRIMARY} size="sm" icon="bx:plus" to="/register_meta">
            {useTranslation("Create new Meta group")}
        </ButtonLink>,
    ];

    if(loading){
        return (
            <Loader/>
        );
    }

    return (
        <Layout
            title={useTranslation("Field groups")}
            actions={actions}
            crumbs={[
                {
                    label: useTranslation("Field groups")
                }
            ]}
        >
            <Table
                rowKey="id"
                isSelectable={() => true}
                belongsTo={metaTypes.META}
                columns={[
                    {
                        key: "name",
                        cell: <span>{useTranslation("Group name")}</span>,
                        sortable: true
                    },
                    {
                        key: "label",
                        cell: <span>{useTranslation("Group label")}</span>,
                        sortable: true
                    },
                    {
                        key: "display",
                        cell: <span>{useTranslation("Display mode")}</span>,
                        sortable: false
                    },
                    {
                        key: "context",
                        cell: <span>{useTranslation("Context")}</span>,
                        sortable: false
                    },
                    {
                        key: "priority",
                        cell: <span>{useTranslation("Priority")}</span>,
                        sortable: false
                    },
                    {
                        key: "location",
                        cell: <span>{useTranslation("Location")}</span>,
                        sortable: false
                    },
                    {
                        key: "fields_count",
                        cell: <span>{useTranslation("Fields count")}</span>,
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
                baseLink="/meta"
                forceUpdate={forceUpdate}
                noRecordsElement={
                    <div className="p-24 bg-white with-shadow">
                        <div className="b-maxi b-rounded p-24 flex-column s-12 text-center">
                            <span>
                                {useTranslation('No meta group found.')}
                            </span>
                            <div>
                                <ButtonLink
                                    testId="create-meta-group-empty-state"
                                    type="button"
                                    style={styleVariants.OUTLINED_PRIMARY}
                                    size="sm"
                                    icon="bx:plus"
                                    to="/register_meta"
                                >
                                    {useTranslation("Create new Meta group")}
                                </ButtonLink>
                            </div>
                        </div>
                    </div>
                }
                renderRow={(record, {handleSelect}) => {
                    if(!isElementHidden(record.id, metaTypes.META)){
                        return (
                            <MetaListElement
                                handleSelect={handleSelect}
                                page={page ? parseInt(page) : 1}
                                record={record}
                                key={record.id}
                            />
                        );
                    }
                    return null;
                }}
            />
        </Layout>
    );
};

export default MetaList;