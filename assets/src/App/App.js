import React, {lazy, memo, Suspense, useEffect, useState} from 'react';
import {createHashRouter, RouterProvider} from 'react-router-dom';
import Loader from "./components/Loader";
import {Toaster} from "react-hot-toast";
import {useDispatch} from "react-redux";
import {fetchGlobalSettings} from "./redux/reducers/fetchGlobalSettingsSlice";

// Pages
const PageCustomPostTypeListPage = lazy(() => import("./pages/CustomPostTypeList"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const TaxonomyListPage = lazy(() => import("./pages/TaxonomyList"));
const MetaListPage = lazy(() => import("./pages/MetaList"));
const SaveCustomPostTypePage = lazy(() => import("./pages/SaveCustomPostType"));
const SaveTaxonomyPage = lazy(() => import("./pages/SaveTaxonomy"));
const ViewCustomPostTypePage = lazy(() => import("./pages/ViewCustomPostType"));
const ViewTaxonomyPage = lazy(() => import("./pages/ViewTaxonomy"));
const AssocCustomPostTypeToTaxonomyPage = lazy(() => import("./pages/AssocCustomPostTypeToTaxonomy"));
const AssocTaxonomyToCustomPostTypePage = lazy(() => import("./pages/AssocTaxonomyToCustomPostType"));
const MetaPage = lazy(() => import("./pages/Meta"));
const ViewProductDataPage = lazy(() => import("./pages/WooCommerce/ViewProductData"));
const SaveProductDataPage = lazy(() => import("./pages/WooCommerce/SaveProductData"));
const ProductDataListPage = lazy(() => import("./pages/WooCommerce/ProductDataList"));
const ProductDataFieldsPage = lazy(() => import("./pages/WooCommerce/ProductDataFields"));

const router = createHashRouter([
        {
            path: "/",
            children: [
                {
                    path:'/:page?',
                    name: "CPT dashboard Page",
                    element: <Suspense fallback={<Loader/>}><PageCustomPostTypeListPage /></Suspense>
                },
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
                    path:"/edit/:postType/:step?",
                    name: "Edit Custom Post Type Page",
                    element: <Suspense fallback={<Loader/>}><SaveCustomPostTypePage /></Suspense>
                },
                {
                    path:'/edit_meta/:id',
                    name: "Meta manager",
                    element: <Suspense fallback={<Loader/>}><MetaPage /></Suspense>
                },
                {
                    path:"/edit_taxonomy/:taxonomy/:step?",
                    name: "Edit Taxonomy Page",
                    element: <Suspense fallback={<Loader/>}><SaveTaxonomyPage /></Suspense>
                },
                {
                    path:'/meta/:page?',
                    name: "Meta fields Page",
                    element: <Suspense fallback={<Loader/>}><MetaListPage /></Suspense>
                },
                {
                    path:'/product-data/product',
                    name: "woocommerce_product_data",
                    element: <Suspense fallback={<Loader/>}><ProductDataListPage /></Suspense>
                },
                {
                    path:'/product-data/product/add',
                    name: "woocommerce_product_data_add",
                    element: <Suspense fallback={<Loader/>}><SaveProductDataPage /></Suspense>
                },
                {
                    path:'/product-data/product/edit/:id',
                    name: "woocommerce_product_data_edit",
                    element: <Suspense fallback={<Loader/>}><SaveProductDataPage /></Suspense>
                },
                {
                    path:'/product-data/product/fields/:id',
                    name: "woocommerce_product_data_fields",
                    element: <Suspense fallback={<Loader/>}><ProductDataFieldsPage /></Suspense>
                },
                {
                    path:'/product-data/product/view/:id',
                    name: "woocommerce_product_data_view",
                    element: <Suspense fallback={<Loader/>}><ViewProductDataPage /></Suspense>
                },
                {
                    path:"/register",
                    name: "Save Custom Post Type Page",
                    element: <Suspense fallback={<Loader/>}><SaveCustomPostTypePage /></Suspense>
                },
                {
                    path:'/register_meta',
                    name: "Register new meta",
                    element: <Suspense fallback={<Loader/>}><MetaPage /></Suspense>
                },
                {
                    path:"/settings",
                    name: "Settings Page",
                    element: <Suspense fallback={<Loader/>}><SettingsPage /></Suspense>
                },
                {
                    path:'/taxonomies/:page?',
                    name: "CPT dashboard Page",
                    element: <Suspense fallback={<Loader/>}><TaxonomyListPage /></Suspense>
                },
                {
                    path:"/register_taxonomy",
                    name: "Save Taxonomy Page",
                    element: <Suspense fallback={<Loader/>}><SaveTaxonomyPage /></Suspense>
                },
                {
                    path:"/view/:postType",
                    name: "View Custom Post Type Page",
                    element: <Suspense fallback={<Loader/>}><ViewCustomPostTypePage /></Suspense>
                },
                {
                    path:"/view_taxonomy/:taxonomy",
                    name: "View Taxonomy Page",
                    element: <Suspense fallback={<Loader/>}><ViewTaxonomyPage /></Suspense>
                }
            ]
        }
    ]
);

const App = memo(() => {

    // redux global state
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchGlobalSettings())
            .then(res => {
                document.globals = res.payload;
                isReady(true);
            })
            .catch(err => console.error(err))
        ;
    }, []);

    const [ready, isReady] = useState(false);

    if(!ready){
        return <Loader/>;
    }

    return(
        <React.Fragment>
            <RouterProvider router={router} />
            <div data-cy="toaster-wrapper">
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
            </div>
        </React.Fragment>
    )
});

export default App;