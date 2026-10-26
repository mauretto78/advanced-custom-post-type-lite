import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import Loader from "../../components/Loader";
import {metaTitle, isRTLOrientation} from "../../utils/misc";
import useTranslation from "../../hooks/useTranslation";
import {fetchTaxonomies} from "../../redux/reducers/fetchTaxonomiesSlice";
import {fetchCustomPostTypes} from "../../redux/reducers/fetchCustomPostTypesSlice";
import Layout from "../../layout/Layout";
import Alert from "../../components/Alert";
import {styleVariants} from "../../constants/styles";
import {filterById, filterByLabel, isEmpty} from "../../utils/objects";
import AssocCustomPostTypeToTaxonomyElement from "./AssocCustomPostTypeToTaxonomyElement";
import Tooltip from "../../components/Tooltip";
import ButtonLink from "../../components/ButtonLink";
import Pagination from "../../components/Pagination/index.jsx";

const AssocCustomPostTypeToTaxonomy = () => {

    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;

    // manage global state
    const dispatch = useDispatch();
    const {data: fetchedTaxonomies, loading: loadingTaxonomies} = useSelector(state => state.fetchTaxonomies);
    const {data: fetchedPosts, loading: loadingPosts} = useSelector(state => state.fetchCustomPostTypes);

    // manage local state
    const {taxonomy} = useParams();
    const {page} = useParams();
    const perPage = (settings?.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
    const totalPages = Math.ceil( fetchedPosts.count / perPage );

    useEffect(() => {
        metaTitle(useTranslation(`${useTranslation("Associate custom post types to")} ${taxonomy}`));
        dispatch(fetchTaxonomies({
            taxonomy: taxonomy
        }));
        dispatch(fetchCustomPostTypes({
            page: page ? page : 1,
            perPage: perPage
        }));
    }, [page, taxonomy]);

    if(loadingTaxonomies && loadingPosts){
        return <Loader/>;
    }

    const actions = [
        <ButtonLink key="register-new-taxonomy" style={styleVariants.PRIMARY} size="sm" icon="bx:plus" to="/register_taxonomy">
            {useTranslation("Register new Taxonomy")}
        </ButtonLink>,
    ];

    return (
        <Layout
            title={useTranslation(`${useTranslation("Associate custom post types to")} ${taxonomy}`)}
            actions={actions}
            crumbs={[
                {
                    label: useTranslation("Registered Taxonomies"),
                    link: "/taxonomies"
                },
                {
                    label: taxonomy,
                    link: `/view_taxonomy/${taxonomy}`
                },
                {
                    label: `${useTranslation("Associate custom post types to")} ${taxonomy}`
                }
            ]}
        >
            <Alert style={styleVariants.SECONDARY} className="mb-24">
                {useTranslation("Only post types registered through ACPT are listed here. Don't see the post type you're looking for (e.g. one added by another plugin, like WooCommerce's Product)?")} <Link to="/">{useTranslation("Sync it in first from the Custom Post Types list")}</Link>.
            </Alert>
            {fetchedTaxonomies.length  > 0 && fetchedPosts.records && fetchedPosts.records.length > 0 ? (
                <div className="responsive with-shadow b-rounded">
                    <table data-testid="taxonomy-table" className={`acpt-table rounded ${isRTLOrientation()}`}>
                        <thead>
                            <tr>
                                <th>
                                    {useTranslation("Name")}
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
                        {fetchedPosts.records && fetchedPosts.records.map((record) => (
                            <AssocCustomPostTypeToTaxonomyElement
                                record={record}
                                key={record.id}
                                taxonomy={taxonomy}
                                defaultChecked={!isEmpty(filterById(fetchedTaxonomies[0].customPostTypes, record.id))}
                            />
                        ))}
                        </tbody>
                        {totalPages > 1 && (
                            <tfoot>
                            <tr>
                                <td colSpan={5}>
                                    <Pagination
                                        currentPage={page ? parseInt(page) : 1}
                                        totalRows={fetchedPosts.count}
                                        baseLink={`/assoc-post-taxonomy/${taxonomy}`}
                                    />
                                </td>
                            </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            ) : (
                <Alert style={styleVariants.SECONDARY}>
                    {useTranslation("No custom post type found.")} <Link to="/register">{useTranslation("Register the first one")}</Link>!
                </Alert>
            )}
        </Layout>
    );
};

export default AssocCustomPostTypeToTaxonomy;