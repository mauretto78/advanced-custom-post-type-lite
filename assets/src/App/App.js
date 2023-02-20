import React, {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
// REUSABLE
import ScrollToTop from "./components/reusable/ScrollToTop";
import Spinner from "./components/reusable/Loader/Spinner";
// PAGES
import NotFound404 from "./components/pages/404";
// STYLES
import 'react-toastify/dist/ReactToastify.css';
// GLOBAL STATE
import {useDispatch, useSelector} from "react-redux";
import {fetchSettings} from "./redux/thunks/fetchSettings";
import {filterByLabel} from "./utils/objects";

const App = () => {

    // manage global state
    const {fetched, loading} = useSelector(state => state.fetchSettingsReducer);
    const dispatch = useDispatch();

    // manage local state
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);

    useEffect(() => {
        dispatch(fetchSettings());
    }, []);

    // handle fetch outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loading){
                setFetchedSuccess(true);
                global.settings = {
                    language: (fetched.length > 0 && filterByLabel(fetched, 'key', 'language').value !== '') ? filterByLabel(fetched, 'key', 'language').value : null,
                };
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    if(!fetchedSuccess){
        return <Spinner/>;
    }

    return(
        <React.Fragment>
            <HashRouter>
                <ScrollToTop />
                <Suspense fallback={Spinner()}>
                    <Switch>
                        <Route exact path='/user-meta' name="user-meta" component={ lazy(() => import('./components/pages/UserMeta')) } />
                        <Route exact path='/assoc-post-taxonomy/:taxonomy' name="assoc_post_taxonomy" component={ lazy(() => import('./components/pages/AssocCustomPostTypeToTaxonomy')) } />
                        <Route exact path='/assoc-taxonomy-post/:postType' name="assoc_taxonomy_post" component={ lazy(() => import('./components/pages/AssocTaxonomyToCustomPostType')) } />
                        <Route exact path='/meta/:postType' name="meta" component={ lazy(() => import('./components/pages/CustomPostTypeMeta')) } />
                        <Route exact path='/register' name="register" component={ lazy(() => import('./components/pages/SaveCustomPostType')) } />
                        <Route exact path='/delete/:postType' name="delete" component={ lazy(() => import('./components/pages/DeleteCustomPostType')) } />
                        <Route exact path='/edit/:postType/:step?' name="edit" component={ lazy(() => import('./components/pages/SaveCustomPostType')) } />
                        <Route exact path='/view/:postType' name="view" component={ lazy(() => import('./components/pages/ViewCustomPostType')) } />
                        <Route exact path='/settings' name="settings" component={ lazy(() => import('./components/pages/Settings')) } />
                        <Route exact path='/taxonomies/:page?' name="taxonomies" component={ lazy(() => import('./components/pages/TaxonomyList')) } />
                        <Route exact path='/register_taxonomy' name="register_taxonomy" component={ lazy(() => import('./components/pages/SaveTaxonomy')) } />
                        <Route exact path='/delete_taxonomy/:taxonomy' name="delete_taxonomy" component={ lazy(() => import('./components/pages/DeleteTaxonomy')) } />
                        <Route exact path='/edit_taxonomy/:taxonomy/:step?' name="edit_taxonomy" component={ lazy(() => import('./components/pages/SaveTaxonomy')) } />
                        <Route exact path='/view_taxonomy/:taxonomy' name="view_taxonomy" component={ lazy(() => import('./components/pages/ViewTaxonomy')) } />
                        <Route exact path='/:page?' name="list" component={ lazy(() => import('./components/pages/CustomPostTypeList'))} />
                        <Route exact path='/product-data/product' name="woocommerce_product_data" component={ lazy(() => import('./components/pages/WooCommerceProductData'))} />
                        <Route exact path='/product-data/product/add' name="woocommerce_product_data_add" component={ lazy(() => import('./components/pages/SaveWooCommerceProductData'))} />
                        <Route exact path='/product-data/product/delete/:id' name="woocommerce_product_data_delete" component={ lazy(() => import('./components/pages/DeleteWooCommerceProductData'))} />
                        <Route exact path='/product-data/product/edit/:id' name="woocommerce_product_data_edit" component={ lazy(() => import('./components/pages/SaveWooCommerceProductData'))} />
                        <Route exact path='/product-data/product/view/:id' name="woocommerce_product_data_view" component={ lazy(() => import('./components/pages/ViewWooCommerceProductData'))} />
                        <Route exact path='/product-data/product/fields/:id' name="woocommerce_product_data_fields" component={ lazy(() => import('./components/pages/WooCommerceProductDataFields'))} />
                        <Route path='/404' name="404" component={NotFound404} />
                    </Switch>
                </Suspense>
            </HashRouter>
            <ToastContainer
                position={toast.POSITION.BOTTOM_RIGHT}
                className="acpt-toastify"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
            />
        </React.Fragment>
    )
};

export default App;