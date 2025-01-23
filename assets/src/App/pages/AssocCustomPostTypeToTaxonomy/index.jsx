import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import Loader from "../../components/Loader";
import {metaTitle} from "../../utils/misc";
import useTranslation from "../../hooks/useTranslation";
import {fetchTaxonomies} from "../../redux/reducers/fetchTaxonomiesSlice";
import {fetchCustomPostTypes} from "../../redux/reducers/fetchCustomPostTypesSlice";
import Layout from "../../layout/Layout";
import Alert from "../../components/Alert";
import {styleVariants} from "../../constants/styles";
import {filterById, isEmpty} from "../../utils/objects";
import AssocCustomPostTypeToTaxonomyElement from "./AssocCustomPostTypeToTaxonomyElement";
import Tooltip from "../../components/Tooltip";
import ButtonLink from "../../components/ButtonLink";

const AssocCustomPostTypeToTaxonomy = () => {

    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;
    const globals = documentGlobals.globals;

    // manage global state
    const dispatch = useDispatch();
    const {data: fetchedTaxonomies, loading: loadingTaxonomies} = useSelector(state => state.fetchTaxonomies);
    const {data: fetchedPosts, loading: loadingPosts} = useSelector(state => state.fetchCustomPostTypes);

    // manage local state
    const {taxonomy} = useParams();

    useEffect(() => {
        metaTitle(useTranslation(`${useTranslation("Associate custom post types to")} ${taxonomy}`));
        dispatch(fetchTaxonomies({
            taxonomy: taxonomy
        }));
        dispatch(fetchCustomPostTypes());
    }, []);

    if(loadingTaxonomies && loadingPosts){
        return <Loader/>;
    }

    const actions = [
        <ButtonLink style={styleVariants.PRIMARY} to="/register_taxonomy">
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
            {fetchedTaxonomies.length  > 0 && fetchedPosts.records && fetchedPosts.records.length > 0 ? (
                <div className="responsive with-shadow b-rounded">
                    <table className={`acpt-table ${globals.is_rtl ? 'rtl' : ''}`}>
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