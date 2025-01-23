import React, {lazy, memo, Suspense, useEffect, useState} from 'react';
import {createHashRouter, RouterProvider} from 'react-router-dom';
import Loader from "./components/Loader";
import {useDispatch} from "react-redux";
import {fetchGlobalSettings} from "./redux/reducers/fetchGlobalSettingsSlice";
import WebFont from 'webfontloader';
import BootError from "./components/Errors/BootError";
import {fetchSettingValue} from "./utils/objects";

// Pages
const AssocCustomPostTypeToTaxonomyPage = lazy(() => import("./pages/AssocCustomPostTypeToTaxonomy"));
const AssocTaxonomyToCustomPostTypePage = lazy(() => import("./pages/AssocTaxonomyToCustomPostType"));
const HealthCheckPage = lazy(() => import("./pages/HealthCheck"));
const MetaListPage = lazy(() => import("./pages/MetaList"));
const MetaPage = lazy(() => import("./pages/Meta"));
const PageCustomPostTypeListPage = lazy(() => import("./pages/CustomPostTypeList"));
const ProductDataFieldsPage = lazy(() => import("./pages/WooCommerce/ProductDataFields"));
const ProductDataListPage = lazy(() => import("./pages/WooCommerce/ProductDataList"));
const SaveCustomPostTypePage = lazy(() => import("./pages/SaveCustomPostType"));
const SaveOptionPages = lazy(() => import("./pages/SaveOptionPages"));
const SaveProductDataPage = lazy(() => import("./pages/WooCommerce/SaveProductData"));
const SaveTaxonomyPage = lazy(() => import("./pages/SaveTaxonomy"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const TaxonomyListPage = lazy(() => import("./pages/TaxonomyList"));
const ViewCustomPostTypePage = lazy(() => import("./pages/ViewCustomPostType"));
const ViewTaxonomyPage = lazy(() => import("./pages/ViewTaxonomy"));
const ViewProductDataPage = lazy(() => import("./pages/WooCommerce/ViewProductData"));

const App = memo(() => {

    // redux global state
    const dispatch = useDispatch();

    // manage local state
    const [error, setError] = useState(null);
    const [ready, isReady] = useState(false);
    const [routes, setRoutes] = useState([]);
    const [font, setFont] = useState('Inter');
    const fontFamily = font !== "Default" ? font : '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue"';

    useEffect(() => {
        dispatch(fetchGlobalSettings())
            .then(res => {

                if(res.error){
                    setError(res.error.name);
                } else {
                    document.globals = {...document.globals, ...res.payload};

                    // load Google fonts
                    setFont(res.payload.globals.font);
                    if(res.payload.globals.font !== "Default"){
                        WebFont.load({
                            google: {
                                families: [res.payload.globals.font]
                            }
                        });
                    }

                    // set routes
                    const settings = document.globals.settings;
                    const enableCtp = fetchSettingValue("enable_cpt", settings, 1);
                    const enableTax = fetchSettingValue("enable_tax", settings, 1);
                    const enableMeta = fetchSettingValue("enable_meta", settings, 1);

                    let r = [
                        {
                            path:'/assoc-post-taxonomy/:taxonomy',
                            name: "Associate Post to Taxonomy",
                            element: <Suspense fallback={<Loader/>}><AssocCustomPostTypeToTaxonomyPage /></Suspense>
                        },
                        {
                            path:'/assoc-taxonomy-post/:postType',
                            name: "Associate Taxonomy to Post",
                            element: <Suspense fallback={<Loader/>}><AssocTaxonomyToCustomPostTypePage /></Suspense>
                        },
                        {
                            path:"/settings",
                            name: "Settings page",
                            element: <Suspense fallback={<Loader/>}><SettingsPage /></Suspense>
                        }
                    ];

                    // post types related pages
                    if(enableCtp === 1){
                        r.push({
                                path:"/view/:postType",
                                name: "View Custom Post Type page",
                                element: <Suspense fallback={<Loader/>}><ViewCustomPostTypePage /></Suspense>
                            },
                            {
                                path:'/:page?',
                                name: "CPT dashboard page",
                                element: <Suspense fallback={<Loader/>}><PageCustomPostTypeListPage /></Suspense>
                            },
                            {
                                path:'/product-data/product',
                                name: "woocommerce_product_data",
                                element: <Suspense fallback={<Loader/>}><ProductDataListPage /></Suspense>
                            },
                            {
                                path:'/product-data/product/add',
                                name: "Add WooCommerce product data",
                                element: <Suspense fallback={<Loader/>}><SaveProductDataPage /></Suspense>
                            },
                            {
                                path:'/product-data/product/edit/:id',
                                name: "Edit WooCommerce product data",
                                element: <Suspense fallback={<Loader/>}><SaveProductDataPage /></Suspense>
                            },
                            {
                                path:'/product-data/product/fields/:id',
                                name: "WooCommerce product data field list",
                                element: <Suspense fallback={<Loader/>}><ProductDataFieldsPage /></Suspense>
                            },
                            {
                                path:'/product-data/product/view/:id',
                                name: "View WooCommerce product data",
                                element: <Suspense fallback={<Loader/>}><ViewProductDataPage /></Suspense>
                            },
                            {
                                path:"/register",
                                name: "Save Custom Post Type page",
                                element: <Suspense fallback={<Loader/>}><SaveCustomPostTypePage /></Suspense>
                            },
                            {
                                path:"/edit/:postType/:step?",
                                name: "Edit Custom Post Type page",
                                element: <Suspense fallback={<Loader/>}><SaveCustomPostTypePage /></Suspense>
                            });
                    }

                    // taxonomies related pages
                    if(enableTax === 1){
                        r.push({
                                path:"/register_taxonomy",
                                name: "Save Taxonomy page",
                                element: <Suspense fallback={<Loader/>}><SaveTaxonomyPage /></Suspense>
                            },
                            {
                                path:'/taxonomies/:page?',
                                name: "CPT dashboard page",
                                element: <Suspense fallback={<Loader/>}><TaxonomyListPage /></Suspense>
                            },
                            {
                                path:"/edit_taxonomy/:taxonomy/:step?",
                                name: "Edit Taxonomy page",
                                element: <Suspense fallback={<Loader/>}><SaveTaxonomyPage /></Suspense>
                            },
                            {
                                path:"/view_taxonomy/:taxonomy",
                                name: "View Taxonomy page",
                                element: <Suspense fallback={<Loader/>}><ViewTaxonomyPage /></Suspense>
                            });
                    }

                    // meta related pages
                    if(enableMeta === 1){
                        r.push({
                                path:'/register_meta',
                                name: "Register new meta",
                                element: <Suspense fallback={<Loader/>}><MetaPage /></Suspense>
                            },
                            {
                                path:'/edit_meta/:id',
                                name: "Meta manager",
                                element: <Suspense fallback={<Loader/>}><MetaPage /></Suspense>
                            },
                            {
                                path:'/meta/:page?',
                                name: "Meta fields page",
                                element: <Suspense fallback={<Loader/>}><MetaListPage /></Suspense>
                            });
                    }

                    if(enableCtp === 0){
                        r.push({
                            path:'/',
                            name: "CPT dashboard page",
                            element: <Suspense fallback={<Loader/>}><SettingsPage /></Suspense>
                        });
                    }

                    setRoutes(r);

                    // App is ready to run
                    isReady(true);
                }

            })
            .catch(err => {
                console.log(err);
                setError(err);
            })
        ;
    }, []);

    if(error){
        return <BootError message={error}/>
    }

    if(!ready){
        return <Loader/>;
    }

    const router = createHashRouter([
            {
                path: "/",
                children: routes
            }
        ]
    );

    return(
        <div id="acpt-admin-app-wrapper"
             style={{
                 fontFamily: `${fontFamily}, sans-serif`
             }}
        >
            <RouterProvider router={router} />
        </div>
    )
});

export default App;