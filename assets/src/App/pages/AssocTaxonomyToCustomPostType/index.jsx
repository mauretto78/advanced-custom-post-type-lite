import React, {useEffect} from 'react';
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {metaTitle, isRTLOrientation} from "../../utils/misc";
import useTranslation from "../../hooks/useTranslation";
import {fetchTaxonomies} from "../../redux/reducers/fetchTaxonomiesSlice";
import {fetchCustomPostTypes} from "../../redux/reducers/fetchCustomPostTypesSlice";
import Loader from "../../components/Loader";
import Layout from "../../layout/Layout";
import {styleVariants} from "../../constants/styles";
import Alert from "../../components/Alert";
import Tooltip from "../../components/Tooltip";
import AssocTaxonomyToCustomPostTypeElement from "./AssocTaxonomyToCustomPostTypeElement";
import {filterById, filterByLabel, isEmpty} from "../../utils/objects";
import ButtonLink from "../../components/ButtonLink";
import Pagination from "../../components/Pagination/index.jsx";

const AssocTaxonomyToCustomPostType = () => {

    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;

    // manage global state
    const dispatch = useDispatch();
    const {data: fetchedTaxonomies, loading: loadingTaxonomies} = useSelector(state => state.fetchTaxonomies);
    const {data: fetchedPosts, loading: loadingPosts} = useSelector(state => state.fetchCustomPostTypes);

    // manage local state
    const {postType} = useParams();
    const {page} = useParams();
    const perPage = (settings?.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
    const totalPages = Math.ceil( fetchedTaxonomies.count / perPage );

    useEffect(() => {
        metaTitle(useTranslation(`${useTranslation("Associate taxonomies to")} ${postType}`));
        dispatch(fetchTaxonomies({
            page: page ? page : 1,
            perPage: perPage
        }));
        dispatch(fetchCustomPostTypes({
            postType:postType
        }));
    }, [page, postType]);

    if(loadingTaxonomies && loadingPosts){
        return <Loader/>;
    }

    const actions = [
        <ButtonLink key="register-new-post-type" style={styleVariants.PRIMARY} size="sm" icon="bx:plus" to="/register">
            {useTranslation("Register new Post Type")}
        </ButtonLink>,
    ];

    return (
        <Layout
            title={`${useTranslation("Associate taxonomies to")} ${postType}`}
            actions={actions}
            crumbs={[
                {
                    label: useTranslation("Registered Custom Post Types"),
                    link: "/"
                },
                {
                    label: postType,
                    link: `/view/${postType}`
                },
                {
                    label: `${useTranslation("Associate taxonomies to")} ${postType}`
                }
            ]}
        >
            {fetchedPosts.length  > 0 && fetchedTaxonomies.records && fetchedTaxonomies.records.length > 0 ? (
                <div className="responsive with-shadow b-rounded">
                    <table className={`acpt-table rounded ${isRTLOrientation()}`}>
                        <thead>
                            <tr>
                                <th>
                                    <Tooltip
                                        tip={useTranslation("Taxonomy slug. The post name/slug. Used for various queries for taxonomy content.")}
                                        label={useTranslation("Slug")}
                                    />
                                </th>
                                <th>
                                    {useTranslation("Type")}
                                </th>
                                <th>
                                    <Tooltip
                                        tip={useTranslation("Singular label. Used when a singular label is needed")}
                                        label={useTranslation("Singular")}
                                    />
                                </th>
                                <th>
                                    <Tooltip
                                        tip={useTranslation("Plural label. Used for the taxonomy admin menu item")}
                                        label={useTranslation("Plural")}
                                    />
                                </th>
                                <th>
                                    {useTranslation("Associate")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetchedTaxonomies.records && fetchedTaxonomies.records.map((record) => (
                                <AssocTaxonomyToCustomPostTypeElement
                                    record={record}
                                    key={record.id}
                                    postType={postType}
                                    defaultChecked={!isEmpty(filterById(fetchedPosts[0].taxonomies, record.id))}
                                />
                            ))}
                        </tbody>
                        {totalPages > 1 && (
                            <tfoot>
                            <tr>
                                <td colSpan={5}>
                                    <Pagination
                                        currentPage={page ? parseInt(page) : 1}
                                        totalRows={fetchedTaxonomies.count}
                                        baseLink={`/assoc-taxonomy-post/${postType}`}
                                    />
                                </td>
                            </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            ) : (
                <Alert style={styleVariants.SECONDARY}>
                    {useTranslation("No taxonomies found.")} <Link to="/register_taxonomy">{useTranslation("Register the first one")}</Link>!
                </Alert>
            )}
        </Layout>
    );
};

export default AssocTaxonomyToCustomPostType;