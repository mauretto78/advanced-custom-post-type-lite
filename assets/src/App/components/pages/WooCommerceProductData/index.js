import React, {useEffect, useRef, useState} from 'react';
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
import {fetchWooCommerceProductData} from "../../../redux/thunks/fetchWooCommerceProductData";
import Spinner from "../../reusable/Loader/Spinner";
import Pagination from "../../reusable/Pagination";
import WooCommerceProductDataListElement from "./WooCommerceProductDataListElement";
import {filterByLabel} from "../../../utils/objects";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";

const WooCommerceProductDataList = () => {

    // manage global state
    const dispatch = useDispatch();
    const {fetched, loading} = useSelector(state => state.fetchWooCommerceProductDataReducer);
    const {loading: settingsLoading, fetched: settings} = useSelector(state => state.fetchSettingsReducer);

    // manage local state
    const {page} = useParams();
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);
    const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
    const totalPages = Math.ceil( fetched.length / perPage );

    useEffect(() => {
        metaTitle("WooCommerce product data");
        changeCurrentAdminMenuLink('');
        dispatch(fetchWooCommerceProductData({
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

    const actions = (
        <Link
            to='/product-data/product/add'
            className="acpt-btn acpt-btn-primary"
        >
            Add product data
        </Link>
    );

    return (
        <Layout>
            <ActionsBar
                title="WooCommerce product data"
                actions={actions}
            />
            <main>
                <Breadcrumbs crumbs={[
                    {
                        label: "Registered Custom Post Types",
                        link: "/"
                    },
                    {
                        label: `WooCommerce product data`
                    }
                ]} />
                {fetched.length > 0 ?
                    <div className="acpt-card">
                        <div className="acpt-card__header borderless">
                            <div className="acpt-card__inner">
                                {fetched.length} record(s) found
                            </div>
                        </div>
                        <div className="acpt-card__body">
                            <div className="acpt-table-responsive">
                                <table className="acpt-table">
                                    <thead>
                                    <tr>
                                        <th className="grey backend" colSpan={ 5 }>Backend UI</th>
                                    </tr>
                                    <tr>
                                        <th>
                                            Name
                                        </th>
                                        <th>
                                            Icon
                                        </th>
                                        <th>
                                            Show on UI
                                        </th>
                                        <th>
                                            Visibility
                                        </th>
                                        <th className="with-border">
                                            Fields
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {fetched.map((element) => <WooCommerceProductDataListElement id={element.id} key={element.id} element={element} /> )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {totalPages > 1 && (
                            <div className="acpt-card__footer" style={{border: "none"}}>
                                <div className="acpt-card__inner">
                                    <Pagination currentPage={page ? page : 1} perPage={perPage} records={fetched.length}/>
                                </div>
                            </div>
                        )}
                    </div>
                    :
                    <div className="acpt-alert acpt-alert-secondary">
                        No product data found. <Link to="/product-data/product/add">Register the first one</Link>!
                    </div>
                }
            </main>
        </Layout>
    );
};

export default WooCommerceProductDataList;


// import React, {useEffect, useRef, useState} from 'react';
// import Breadcrumbs from "../../reusable/Breadcrumbs";
// import {Icon} from "@iconify/react";
// import {useDispatch, useSelector} from "react-redux";
// import {Link, useHistory, useParams} from "react-router-dom";
// import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
// import {fetchWooCommerceProductData} from "../../../redux/thunks/fetchWooCommerceProductData";
// import Copyright from "../../reusable/Copyright";
// import Spinner from "../../reusable/Loader/Spinner";
// import Pagination from "../../reusable/Pagination";
// import WooCommerceProductDataListElement from "./WooCommerceProductDataListElement";
// import {filterByLabel} from "../../../utils/objects";
//
// const WooCommerceProductDataList = () => {
//
//     // manage global state
//     const dispatch = useDispatch();
//     const {fetched, loading} = useSelector(state => state.fetchWooCommerceProductDataReducer);
//     const {loading: settingsLoading, fetched: settings} = useSelector(state => state.fetchSettingsReducer);
//
//     // manage local state
//     const {page} = useParams();
//     const didMountRef = useRef(false);
//     const [fetchedSuccess, setFetchedSuccess] = useState(null);
//     const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
//     const history = useHistory();
//
//     useEffect(() => {
//         metaTitle("WooCommerce product data");
//         changeCurrentAdminMenuLink('');
//         dispatch(fetchWooCommerceProductData({
//             page: page ? page : 1,
//             perPage: perPage
//         }));
//     }, [page]);
//
//     // handle fetch outcome
//     useEffect(() => {
//         if (didMountRef.current){
//             if(!loading){
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
//                     label: `WooCommerce product data`
//                 }
//             ]} />
//
//             <h1 className="acpt-title vertical-center">
//                 <Icon icon="icon-park-outline:ad-product" color="#02c39a" width="18px"/>
//                 &nbsp;
//                 WooCommerce product data
//             </h1>
//             <div className="acpt-buttons">
//                 <Link
//                     to='/product-data/product/add'
//                     className="acpt-btn acpt-btn-primary-o"
//                 >
//                     <Icon icon="bx:bx-list-plus" width="18px"/>
//                     &nbsp;
//                     Add product data
//                 </Link>
//             </div>
//             {fetched.length > 0 ?
//                 <div className="acpt-card">
//                     <div className="acpt-card__header borderless">
//                         <div className="acpt-card__inner">
//                             {fetched.length} record(s) found
//                         </div>
//                     </div>
//                     <div className="acpt-card__body">
//                         <div className="acpt-table-responsive">
//                             <table className="acpt-table">
//                                 <thead>
//                                 <tr>
//                                     <th className="grey backend" colSpan={ 5 }>Backend UI</th>
//                                 </tr>
//                                 <tr>
//                                     <th>
//                                         Name
//                                     </th>
//                                     <th>
//                                         Icon
//                                     </th>
//                                     <th>
//                                         Show on UI
//                                     </th>
//                                     <th>
//                                         Visibility
//                                     </th>
//                                     <th className="with-border">
//                                         Fields
//                                     </th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                     {fetched.map((element) => <WooCommerceProductDataListElement id={element.id} key={element.id} element={element} /> )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                     <div className="acpt-card__footer" style={{border: "none"}}>
//                         <div className="acpt-card__inner">
//                             <Pagination currentPage={page ? page : 1} perPage={perPage} records={fetched.length}/>
//                         </div>
//                     </div>
//                 </div>
//                 :
//                 <div className="acpt-alert acpt-alert-secondary">
//                     No product data found. <Link to="/product-data/product/add">Register the first one</Link>!
//                 </div>
//             }
//             <Copyright/>
//         </div>
//     );
// };
//
// export default WooCommerceProductDataList;