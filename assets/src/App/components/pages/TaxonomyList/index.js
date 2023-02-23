import React, {useEffect, useRef, useState} from 'react';
import {changeCurrentAdminMenuLink, metaTitle, refreshPage} from "../../../utils/misc";
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory, useParams} from "react-router-dom";
import Spinner from "../../reusable/Loader/Spinner";
import {fetchTaxonomiesCount} from "../../../redux/thunks/fetchTaxonomiesCount";
import {fetchTaxonomies} from "../../../redux/thunks/fetchTaxonomies";
import Pagination from "../../reusable/Pagination";
import TaxonomyListElement from "./TaxonomyListElement";
import {Icon} from "@iconify/react";
import Tippy from "../../reusable/Tippy";
import {translate} from "../../../localization";
import {filterByLabel} from "../../../utils/objects";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";
import {metaTypes} from "../../../constants/metaTypes";
import {toast} from "react-toastify";

const TaxonomyList = () => {

    // manage global state
    const dispatch = useDispatch();
    const {fetched, loading} = useSelector(state => state.fetchTaxonomiesReducer);
    const {fetched: fetchedCount, loading:loadingCount} = useSelector(state => state.fetchTaxonomiesCountReducer);
    const {loading: settingsLoading, fetched: settings} = useSelector(state => state.fetchSettingsReducer);

    // manage local state
    const {page} = useParams();
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);
    const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
    const totalPages = Math.ceil( fetchedCount / perPage );
    const history = useHistory();

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
            if(!loading && !settingsLoading){
                setFetchedSuccess(true);
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    if(!fetchedSuccess){
        return <Spinner/>;
    }

    const button =
        <Link
            className="acpt-btn acpt-btn-primary"
            to="/register_taxonomy"
        >
            Register new Taxonomy
        </Link>;

    return (
        <Layout>
            <ActionsBar
                title="Registered Taxonomies"
                actions={button}
            />
            <main>
                <Breadcrumbs crumbs={[
                    {
                        label: "Registered Taxonomies"
                    }
                ]} />
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
                                        <th className="grey backend with-border" colSpan={5}>Backend UI</th>
                                        <th className="grey frontend" colSpan={1}>Frontend UI</th>
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
                                        <th>Type</th>
                                        <th>
                                            Meta boxes
                                            &nbsp;
                                            <Tippy title="Associated meta boxes">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="18px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                        <th>
                                            Associated post types
                                            &nbsp;
                                            <Tippy title="Associate custom post types here">
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
                                        <th className="text-center">
                                            Single template
                                            &nbsp;
                                            <Tippy title="The single template for taxonomy term">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="18px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {fetched.map((element) => <TaxonomyListElement id={element.id} key={element.id} element={element} />)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {totalPages > 1 && (
                            <div className="acpt-card__footer" style={{border: "none"}}>
                                <div className="acpt-card__inner">
                                    <Pagination currentPage={page ? page : 1} perPage={perPage} records={fetchedCount}/>
                                </div>
                            </div>
                        )}
                    </div>
                    :
                    <div className="acpt-alert acpt-alert-secondary">
                        No taxonomies found. <Link to="/register_taxonomy">Register the first one</Link>!
                    </div>
                }
            </main>
        </Layout>
    );
};

export default TaxonomyList;



// import React, {useEffect, useRef, useState} from 'react';
// import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
// import Breadcrumbs from "../../reusable/Breadcrumbs";
// import {useDispatch, useSelector} from "react-redux";
// import {Link, useParams} from "react-router-dom";
// import Spinner from "../../reusable/Loader/Spinner";
// import {fetchTaxonomiesCount} from "../../../redux/thunks/fetchTaxonomiesCount";
// import {fetchTaxonomies} from "../../../redux/thunks/fetchTaxonomies";
// import Pagination from "../../reusable/Pagination";
// import TaxonomyListElement from "./TaxonomyListElement";
// import {Icon} from "@iconify/react";
// import Tippy from "../../reusable/Tippy";
// import {translate} from "../../../localization";
// import Copyright from "../../reusable/Copyright";
// import {filterByLabel} from "../../../utils/objects";
//
// const TaxonomyList = () => {
//
//     // manage global state
//     const dispatch = useDispatch();
//     const {fetched, loading} = useSelector(state => state.fetchTaxonomiesReducer);
//     const {fetched: fetchedCount, loading:loadingCount} = useSelector(state => state.fetchTaxonomiesCountReducer);
//     const {loading: settingsLoading, fetched: settings} = useSelector(state => state.fetchSettingsReducer);
//
//     // manage local state
//     const {page} = useParams();
//     const didMountRef = useRef(false);
//     const [fetchedSuccess, setFetchedSuccess] = useState(null);
//     const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
//
//     useEffect(() => {
//         metaTitle(translate("taxonomy_list.title"));
//         changeCurrentAdminMenuLink('#/taxonomies');
//         dispatch(fetchTaxonomiesCount());
//         dispatch(fetchTaxonomies({
//             page: page ? page : 1,
//             perPage: perPage
//         }));
//     }, [page]);
//
//     // handle fetch outcome
//     useEffect(() => {
//         if (didMountRef.current){
//             if(!loading && !settingsLoading){
//                 setFetchedSuccess(true);
//             }
//         } else {
//             didMountRef.current = true;
//         }
//     }, [loading]);
//
//     if(!fetchedSuccess){
//         return <Spinner/>;
//     }
//
//     return (
//         <div>
//             <Breadcrumbs crumbs={[
//                 {
//                     label: "Registered Custom Post Types",
//                     link: "/"
//                 },
//                 {
//                     label: "Registered Taxonomies"
//                 }
//             ]} />
//             <h1 className="acpt-title">
//                 <Icon icon="bx:bx-purchase-tag" color="#02c39a" width="18px" />
//                 &nbsp;
//                 Registered Taxonomies
//             </h1>
//             <div className="acpt-buttons">
//                 <Link
//                     className="acpt-btn acpt-btn-primary-o"
//                     to="/register_taxonomy">
//                     <Icon icon="bx:bx-list-plus" width="18px" />
//                     &nbsp;
//                     Register new Taxonomy
//                 </Link>
//             </div>
//             {fetched.length > 0 ?
//                 <div className="acpt-card">
//                     <div className="acpt-card__header">
//                         <div className="acpt-card__inner">
//                             {fetchedCount} record(s) found
//                         </div>
//                     </div>
//                     <div className="acpt-card__body">
//                         <div className="acpt-table-responsive">
//                             <table className="acpt-table">
//                                 <thead>
//                                     <tr>
//                                         <th className="grey backend with-border" colSpan={5}>Registered taxonomies</th>
//                                         <th className="grey frontend" colSpan={1}>Associated</th>
//                                     </tr>
//                                     <tr>
//                                         <th>
//                                             Slug
//                                             &nbsp;
//                                             <Tippy title="Taxonomy slug. The post name/slug. Used for various queries for taxonomy content.">
//                                                 <span className="helper">
//                                                     <Icon icon="bx:bx-help-circle" width="18px"/>
//                                                 </span>
//                                             </Tippy>
//                                         </th>
//                                         <th/>
//                                         <th>
//                                             Singular
//                                             &nbsp;
//                                             <Tippy title="Singular label. Used when a singular label is needed">
//                                                 <span className="helper">
//                                                     <Icon icon="bx:bx-help-circle" width="18px"/>
//                                                 </span>
//                                             </Tippy>
//                                         </th>
//                                         <th>
//                                             Plural
//                                             &nbsp;
//                                             <Tippy title="Plural label. Used for the taxonomy admin menu item">
//                                                 <span className="helper">
//                                                     <Icon icon="bx:bx-help-circle" width="18px"/>
//                                                 </span>
//                                             </Tippy>
//                                         </th>
//                                         <th className="with-border">
//                                             Post count
//                                             &nbsp;
//                                             <Tippy title="Published posts count associated with the taxonomy">
//                                                 <span className="helper">
//                                                     <Icon icon="bx:bx-help-circle" width="18px"/>
//                                                 </span>
//                                             </Tippy>
//                                         </th>
//                                         <th>
//                                             Custom post types
//                                             &nbsp;
//                                             <Tippy title="Associate custom post types here">
//                                                 <span className="helper">
//                                                     <Icon icon="bx:bx-help-circle" width="18px"/>
//                                                 </span>
//                                             </Tippy>
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                 {fetched.map((element) => <TaxonomyListElement id={element.id} key={element.id} element={element} />)}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                     <div className="acpt-card__footer" style={{border: "none"}}>
//                         <div className="acpt-card__inner">
//                             <Pagination currentPage={page ? page : 1} perPage={perPage} records={fetchedCount}/>
//                         </div>
//                     </div>
//                 </div>
//                 :
//                 <div className="acpt-alert acpt-alert-secondary">
//                     No taxonomies found. <Link to="/register_taxonomy">Register the first one</Link>!
//                 </div>
//             }
//             <Copyright/>
//         </div>
//     );
// };
//
// export default TaxonomyList;