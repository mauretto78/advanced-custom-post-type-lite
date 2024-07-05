import React, {useEffect} from 'react';
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {metaTitle} from "../../utils/misc";
import useTranslation from "../../hooks/useTranslation";
import {fetchTaxonomies} from "../../redux/reducers/fetchTaxonomiesSlice";
import {fetchCustomPostTypes} from "../../redux/reducers/fetchCustomPostTypesSlice";
import Loader from "../../components/Loader";
import Layout from "../../layout/Layout";
import {styleVariants} from "../../constants/styles";
import Alert from "../../components/Alert";
import Tooltip from "../../components/Tooltip";
import AssocTaxonomyToCustomPostTypeElement from "./AssocTaxonomyToCustomPostTypeElement";
import {filterById, isEmpty} from "../../utils/objects";
import ButtonLink from "../../components/ButtonLink";

const AssocTaxonomyToCustomPostType = () => {

    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;
    const globals = documentGlobals.globals;

    // manage global state
    const dispatch = useDispatch();
    const {data: fetchedTaxonomies, loading: loadingTaxonomies} = useSelector(state => state.fetchTaxonomies);
    const {data: fetchedPosts, loading: loadingPosts} = useSelector(state => state.fetchCustomPostTypes);

    // manage local state
    const {postType} = useParams();

    useEffect(() => {
        metaTitle(useTranslation(`${useTranslation("Associate taxonomies to")} ${postType}`));
        dispatch(fetchTaxonomies());
        dispatch(fetchCustomPostTypes({
            postType:postType
        }));
    }, []);

    if(loadingTaxonomies && loadingPosts){
        return <Loader/>;
    }

    const actions = [
        <ButtonLink style={styleVariants.PRIMARY} to="/register">
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
                <div className="responsive">
                    <table className={`acpt-table with-shadow ${globals.is_rtl ? 'rtl' : ''}`}>
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