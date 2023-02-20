import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {metaTitle} from "../../../utils/misc";
import {fetchTaxonomies} from "../../../redux/thunks/fetchTaxonomies";
import {fetchPostTypes} from "../../../redux/thunks/fetchPostTypes";
import Spinner from "../../reusable/Loader/Spinner";
import {filterById, isEmpty} from "../../../utils/objects";
import {toast} from "react-toastify";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import Tippy from "../../reusable/Tippy";
import {Icon} from "@iconify/react";
import AssocCustomPostTypeElement from "./AssocCustomPostTypeElement";

const AssocCustomPostTypeToTaxonomy = () => {

    // manage global state
    const dispatch = useDispatch();
    const {success: successAssocPostToTaxonomy, loading: loadingAssocPostToTaxonomy, errors: assocPostToTaxonomyErrors} = useSelector(state => state.assocPostToTaxonomyReducer);
    const {fetched: fetchedTaxonomies, loading: loadingTaxonomies} = useSelector(state => state.fetchTaxonomiesReducer);
    const {fetched: fetchedPosts, loading: loadingPosts} = useSelector(state => state.fetchPostTypesReducer);

    // manage local state
    const {taxonomy} = useParams();
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);

    useEffect(() => {
        metaTitle("Registered Taxonomies");
        dispatch(fetchPostTypes());
        dispatch(fetchTaxonomies({
            taxonomy:taxonomy
        }));
    }, []);

    // handle fetch outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loadingTaxonomies && !loadingPosts){
                setFetchedSuccess(true);

                const f = [];
                fetchedPosts.map((item)=>{
                    f.push({
                        id: item.id,
                        checked: !isEmpty(filterById(fetchedTaxonomies[0].customPostTypes, item.id)),
                    });
                });
            }
        } else {
            didMountRef.current = true;
        }
    }, [loadingTaxonomies, loadingPosts]);

    // handle assoc outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loadingAssocPostToTaxonomy){



                if(successAssocPostToTaxonomy){
                    toast.success("Taxonomy was associated to selected Custom post types");
                }

                if(assocPostToTaxonomyErrors.length > 0){
                    assocPostToTaxonomyErrors.map((error) => {
                        toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [loadingAssocPostToTaxonomy]);

    if(!fetchedSuccess){
        return <Spinner/>;
    }

    return (
        <Layout>
            <ActionsBar
                title={`Associate custom post types to ${taxonomy}`}
            />
            <main>
                <Breadcrumbs crumbs={[
                    {
                        label: "Registered Taxonomies",
                        link: "/taxonomies"
                    },
                    {
                        label: taxonomy,
                        link: `/view/${taxonomy}`
                    },
                    {
                        label: `Associate custom post types to ${taxonomy}`
                    }
                ]} />
                {fetchedPosts.length > 0 ?
                    <div className="acpt-card">
                        <div className="acpt-card__header">
                            <div className="acpt-card__inner">
                                {fetchedPosts.length} custom post types registered
                            </div>
                        </div>
                        <div className="acpt-card__body">
                            <div className="acpt-table-responsive">
                                <table className="acpt-table">
                                    <thead>
                                        <tr>
                                            <th className="grey backend with-border" colSpan={5}>Custom post type data</th>
                                            <th className="grey frontend" colSpan={1}>Actions</th>
                                        </tr>
                                        <tr>
                                            <th>
                                                Name
                                            </th>
                                            <th>
                                                Type
                                            </th>
                                            <th>
                                                Singular
                                                &nbsp;
                                                <Tippy title="Singular label. Used when a singular label is needed">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="18px"/>
                                                </span>
                                                </Tippy>
                                            </th>
                                            <th>
                                                Plural
                                                &nbsp;
                                                <Tippy title="Plural label. Used for the custom post type admin menu item">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="18px"/>
                                                </span>
                                                </Tippy>
                                            </th>
                                            <th className="with-border">
                                                Post count
                                                &nbsp;
                                                <Tippy title="Published posts count associated with this post type">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="18px"/>
                                                </span>
                                                </Tippy>
                                            </th>
                                            <th>
                                                Associate
                                                &nbsp;
                                                <Tippy title="Associate custom post types here">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="18px"/>
                                                </span>
                                                </Tippy>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fetchedPosts.map((element)=>
                                            <AssocCustomPostTypeElement
                                                taxonomy={taxonomy}
                                                id={element.id}
                                                key={element.id}
                                                element={element}
                                                defaultChecked={!isEmpty(filterById(fetchedTaxonomies[0].customPostTypes, element.id))}
                                            />
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="acpt-alert acpt-alert-secondary">
                        No custom post type found. <Link to="/register">Register the first one</Link>!
                    </div>
                }
            </main>
        </Layout>
    );
};

export default AssocCustomPostTypeToTaxonomy;