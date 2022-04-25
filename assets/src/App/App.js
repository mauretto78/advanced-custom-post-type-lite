import React, {Suspense, useEffect, useRef, useState} from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
// REUSABLE
import ScrollToTop from "./components/reusable/ScrollToTop";
import Spinner from "./components/reusable/Loader/Spinner";
// PAGES
import ViewCustomPostType from "./components/pages/ViewCustomPostType";
import SaveCustomPostType from "./components/pages/SaveCustomPostType";
import CustomPostTypeList from "./components/pages/CustomPostTypeList";
import CustomPostTypeMeta from "./components/pages/CustomPostTypeMeta";
import DeleteCustomPostType from "./components/pages/DeleteCustomPostType";
import NotFound404 from "./components/pages/404";
import TaxonomyList from "./components/pages/TaxonomyList";
import SaveTaxonomy from "./components/pages/SaveTaxonomy";
import AssocTaxonomyToCustomPostType from "./components/pages/AssocTaxonomyToCustomPostType";
import DeleteTaxonomy from "./components/pages/DeleteTaxonomy";
import ViewTaxonomy from "./components/pages/ViewTaxonomy";
import Settings from "./components/pages/Settings";
import WooCommerceProductDataList from "./components/pages/WooCommerceProductData";
import SaveWooCommerceProductData from "./components/pages/SaveWooCommerceProductData";
import DeleteWooCommerceProductData from "./components/pages/DeleteWooCommerceProductData";
import ViewWooCommerceProductData from "./components/pages/ViewWooCommerceProductData";
import WooCommerceProductDataFields from "./components/pages/WooCommerceProductDataFields";
// STYLES
import 'react-toastify/dist/ReactToastify.css';
// GLOBAL STATE
import {useDispatch, useSelector} from "react-redux";
import {fetchSettings} from "./redux/thunks/fetchSettings";
import {filterByLabel} from "./utils/objects";
import RateAlert from "./components/reusable/RateAlert";

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
                    <RateAlert/>
                    <Switch>
                        <Route exact path='/user-meta' name="user-meta" component={ lazy(() => import('./components/pages/UserMeta')) } />
                        <Route exact path='/assoc-taxonomy-post/:postType' name="assoc_taxonomy_post" component={AssocTaxonomyToCustomPostType} />
                        <Route exact path='/meta/:postType' name="meta" component={CustomPostTypeMeta} />
                        <Route exact path='/register' name="register" component={SaveCustomPostType} />
                        <Route exact path='/delete/:postType' name="delete" component={DeleteCustomPostType} />
                        <Route exact path='/edit/:postType/:step?' name="edit" component={SaveCustomPostType} />
                        <Route exact path='/view/:postType' name="view" component={ViewCustomPostType} />
                        <Route exact path='/settings' name="settings" component={Settings} />
                        <Route exact path='/taxonomies/:page?' name="taxonomies" component={TaxonomyList} />
                        <Route exact path='/register_taxonomy' name="register_taxonomy" component={SaveTaxonomy} />
                        <Route exact path='/delete_taxonomy/:taxonomy' name="delete_taxonomy" component={DeleteTaxonomy} />
                        <Route exact path='/edit_taxonomy/:taxonomy/:step?' name="edit_taxonomy" component={SaveTaxonomy} />
                        <Route exact path='/view_taxonomy/:taxonomy' name="view_taxonomy" component={ViewTaxonomy} />
                        <Route exact path='/:page?' name="list" component={CustomPostTypeList} />
                        <Route exact path='/product-data/product' name="woocommerce_product_data" component={WooCommerceProductDataList} />
                        <Route exact path='/product-data/product/add' name="woocommerce_product_data_add" component={SaveWooCommerceProductData} />
                        <Route exact path='/product-data/product/delete/:id' name="woocommerce_product_data_delete" component={DeleteWooCommerceProductData} />
                        <Route exact path='/product-data/product/edit/:id' name="woocommerce_product_data_edit" component={SaveWooCommerceProductData} />
                        <Route exact path='/product-data/product/view/:id' name="woocommerce_product_data_view" component={ViewWooCommerceProductData} />
                        <Route exact path='/product-data/product/fields/:id' name="woocommerce_product_data_fields" component={WooCommerceProductDataFields} />
                        <Route path='/404' name="404" component={NotFound404} />
                    </Switch>
                </Suspense>
            </HashRouter>
            <ToastContainer
                position={toast.POSITION.TOP_CENTER}
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