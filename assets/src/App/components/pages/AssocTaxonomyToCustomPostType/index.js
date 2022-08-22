import React, {useEffect, useRef, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {metaTitle} from "../../../utils/misc";
import {fetchTaxonomies} from "../../../redux/thunks/fetchTaxonomies";
import Spinner from "../../reusable/Loader/Spinner";
import Breadcrumbs from "../../reusable/Breadcrumbs";
import AssocTaxonomyElement from "./AssocTaxonomyElement";
import {fetchPostTypes} from "../../../redux/thunks/fetchPostTypes";
import {filterById, isEmpty} from "../../../utils/objects";
import {toast} from "react-toastify";
import {Icon} from "@iconify/react";
import Tippy from "../../reusable/Tippy";
import Copyright from "../../reusable/Copyright";

const AssocTaxonomyToCustomPostType = () => {

    // manage global state
    const dispatch = useDispatch();
    const {success: successAssocTaxonomyToPost, loading: loadingAssocTaxonomyToPost, errors: assocTaxonomyToPostErrors} = useSelector(state => state.assocTaxonomyToPostReducer);
    const {fetched: fetchedTaxonomies, loading: loadingTaxonomies} = useSelector(state => state.fetchTaxonomiesReducer);
    const {fetched: fetchedPosts, loading: loadingPosts} = useSelector(state => state.fetchPostTypesReducer);

    // manage local state
    const {postType} = useParams();
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);

    useEffect(() => {
        metaTitle("Registered Taxonomies");
        dispatch(fetchTaxonomies());
        dispatch(fetchPostTypes({
            postType:postType
        }));
    }, []);

    // handle fetch outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loadingTaxonomies && !loadingPosts){
                setFetchedSuccess(true);

                const f = [];
                fetchedTaxonomies.map((item)=>{
                    f.push({
                        id: item.id,
                        checked: !isEmpty(filterById(fetchedPosts[0].taxonomies, item.id)),
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
            if(!loadingAssocTaxonomyToPost){
                if(successAssocTaxonomyToPost){
                    toast.success("Custom post type was associated to selected taxonomies");
                }

                if(assocTaxonomyToPostErrors.length > 0){
                    assocTaxonomyToPostErrors.map((error) => {
                        toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [loadingAssocTaxonomyToPost]);

    if(!fetchedSuccess){
        return <Spinner/>;
    }

    return (
        <div>
            <Breadcrumbs crumbs={[
                {
                    label: "Registered Custom Post Types",
                    link: "/"
                },
                {
                    label: "Registered Taxonomies",
                    link: "/taxonomies"
                },
                {
                    label: postType,
                    link: `/view/${postType}`
                },
                {
                    label: `Associate taxonomies to ${postType}`
                }
            ]} />
            <h1 className="acpt-title">
                <Icon icon="bx:bx-repost" color="#02c39a" width="18px"/>
                &nbsp;
                Associate taxonomies to {postType}
            </h1>
            {fetchedTaxonomies.length > 0 ?
                <div className="acpt-card">
                    <div className="acpt-card__header">
                        <div className="acpt-card__inner">
                            {fetchedTaxonomies.length} taxonomies registered
                        </div>
                    </div>
                    <div className="acpt-card__body">
                        <div className="acpt-table-responsive">
                            <table className="acpt-table">
                                <thead>
                                    <tr>
                                        <th className="grey backend with-border" colSpan={5}>Taxonomy data</th>
                                        <th className="grey frontend" colSpan={1}>Actions</th>
                                    </tr>
                                    <tr>
                                        <th>
                                            Slug
                                            &nbsp;
                                            <Tippy title="Taxonomy slug. The post name/slug. Used for various queries for taxonomy content.">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="18px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                        <th/>
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
                                            <Tippy title="Plural label. Used for the taxonomy admin menu item">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="18px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                        <th className="with-border">
                                            Post count
                                            &nbsp;
                                            <Tippy title="Published posts count associated with the taxonomy">
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
                                    {fetchedTaxonomies.map((element) =>
                                        <AssocTaxonomyElement
                                            //onChange={handleChange}
                                            postType={postType}
                                            id={element.id}
                                            key={element.id}
                                            element={element}
                                            defaultChecked={!isEmpty(filterById(fetchedPosts[0].taxonomies, element.id))}
                                        />)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                :
                <div className="acpt-alert acpt-alert-secondary">
                    No taxonomies found. <Link to="/register_taxonomy">Register the first one</Link>!
                </div>
            }
            <Copyright/>
        </div>
    );
};

export default AssocTaxonomyToCustomPostType;