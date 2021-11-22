import React, {useEffect, useRef, useState} from 'react';
import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import Spinner from "../../reusable/Loader/Spinner";
import {fetchTaxonomiesCount} from "../../../redux/thunks/fetchTaxonomiesCount";
import {fetchTaxonomies} from "../../../redux/thunks/fetchTaxonomies";
import Pagination from "../../reusable/Pagination";
import TaxonomyListElement from "./TaxonomyListElement";
import {Icon} from "@iconify/react";
import Tippy from "../../reusable/Tippy";
import {translate} from "../../../localization";
import Copyright from "../../reusable/Copyright";

const TaxonomyList = () => {

    // manage global state
    const dispatch = useDispatch();
    const {fetched, loading} = useSelector(state => state.fetchTaxonomiesReducer);
    const {fetched: fetchedCount, loading:loadingCount} = useSelector(state => state.fetchTaxonomiesCountReducer);

    // manage local state
    const {page} = useParams();
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);
    const perPage = 20;

    useEffect(() => {
        metaTitle(translate("taxonomy_list.title"));
        changeCurrentAdminMenuLink('#/taxonomies');
        dispatch(fetchTaxonomiesCount());
        dispatch(fetchTaxonomies({
            page: page ? page : 1,
            perPage: perPage
        }));
    }, [page]);

    // handle fetch outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loading){
                setFetchedSuccess(true);
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

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
                    label: "Registered Taxonomies"
                }
            ]} />
            <h1 className="acpt-title">
                <Icon icon="bx:bx-purchase-tag" color="#02c39a" width="20px" />
                &nbsp;
                Registered Taxonomies
            </h1>
            <div className="acpt-buttons">
                <Link
                    className="acpt-btn acpt-btn-primary-o"
                    to="/register_taxonomy">
                    <Icon icon="bx:bx-list-plus" width="24px" />
                    &nbsp;
                    Register new Taxonomy
                </Link>
            </div>
            {fetched.length > 0 ?
                <div className="acpt-card">
                    <div className="acpt-card__header">
                        <div className="acpt-card__inner">
                            {fetchedCount} record(s) found
                        </div>
                    </div>
                    <div className="acpt-card__body">
                        <div className="acpt-table-responsive">
                            <table className="acpt-table">
                                <thead>
                                    <tr>
                                        <th className="grey backend with-border" colSpan={4}>Registered taxonomies</th>
                                        <th className="grey frontend" colSpan={1}>Associated</th>
                                    </tr>
                                    <tr>
                                        <th>Slug</th>
                                        <th>
                                            Singular
                                            &nbsp;
                                            <Tippy title="Singular label">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="24px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                        <th>
                                            Plural
                                            &nbsp;
                                            <Tippy title="Plural label">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="24px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                        <th className="with-border">
                                            Post count
                                            &nbsp;
                                            <Tippy title="Published posts count">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="24px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                        <th>Custom post types</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {fetched.map((element) => <TaxonomyListElement id={element.id} key={element.id} element={element} />)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="acpt-card__footer" style={{border: "none"}}>
                        <div className="acpt-card__inner">
                            <Pagination currentPage={page ? page : 1} perPage={perPage} records={fetchedCount}/>
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

export default TaxonomyList;