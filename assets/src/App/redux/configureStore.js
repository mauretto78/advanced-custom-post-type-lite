import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {stepsReducer} from "./reducers/stepsReducer";
import {metaStateReducer} from "./reducers/metaStateReducer";
import {userMetaStateReducer} from "./reducers/userMetaStateReducer";
import {fetchMetaReducer} from "./reducers/fetchMetaReducer";
import {fetchPostTypesReducer} from "./reducers/fetchCustomPostTypesReducer";
import {fetchUserMetaReducer} from "./reducers/fetchUserMetaReducer";
import {deleteCustomPostTypeReducer} from "./reducers/deleteCustomPostTypeReducer";
import {fetchPostTypesCountReducer} from "./reducers/fetchCustomPostTypesCountReducer";
import {fetchSettingsReducer} from "./reducers/fetchSettingsReducer";
import {fetchInversedMetaReducer} from "./reducers/fetchInversedMetaReducer";
import {importFileReducer} from "./reducers/importFileReducer";
import {exportFileReducer} from "./reducers/exportFileReducer";
import {fetchTaxonomiesReducer} from "./reducers/fetchTaxonomiesReducer";
import {fetchTaxonomiesCountReducer} from "./reducers/fetchTaxonomiesCountReducer";
import {assocPostToTaxonomyReducer} from "./reducers/assocPostToTaxonomyReducer";
import {assocTaxonomyToPostReducer} from "./reducers/assocTaxonomyToPostReducer";
import {deleteTaxonomyReducer} from "./reducers/deleteTaxonomyReducer";
import {fetchPostsReducer} from "./reducers/fetchPostsReducer";
import {fetchPostDataReducer} from "./reducers/fetchPostDataReducer";
import {fetchPostTypeTemplateReducer} from "./reducers/fetchPostTypeTemplateReducer";
import {saveSettingsReducer} from "./reducers/saveSettingsReducer";
import {saveCustomPostTemplateReducer} from "./reducers/saveCustomPostTemplateReducer";
import {deletePostTypeTemplateReducer} from "./reducers/deletePostTypeTemplateReducer";
import {fetchSidebarsReducer} from "./reducers/fetchSidebarsReducer";
import {fetchPreviewLinkReducer} from "./reducers/fetchPreviewLinkReducer";
import {fetchHeadersAndFootersReducer} from "./reducers/fetchHeadersAndFootersReducer";
import {syncPostsReducer} from "./reducers/syncPostsReducer";
import {saveWooCommerceProductDataReducer} from "./reducers/saveWooCommerceProductDataReducer";
import {fetchWooCommerceProductDataReducer} from "./reducers/fetchWooCommerceProductDataReducer";
import {deleteWooCommerceProductDataReducer} from "./reducers/deleteWooCommerceProductDataReducer";
import {fetchWooCommerceProductDataFieldsReducer} from "./reducers/fetchWooCommerceProductDataFieldsReducer";
import {WooCommerceFieldsStateReducer} from "./reducers/WooCommerceFieldsStateReducer";
import {sluggifyReducer} from "./reducers/sluggifyReducer";

const reducers = {
    assocPostToTaxonomyReducer,
    assocTaxonomyToPostReducer,
    deleteCustomPostTypeReducer,
    deletePostTypeTemplateReducer,
    deleteTaxonomyReducer,
    deleteWooCommerceProductDataReducer,
    exportFileReducer,
    fetchHeadersAndFootersReducer,
    fetchInversedMetaReducer,
    fetchMetaReducer,
    fetchPostDataReducer,
    fetchPostTypeTemplateReducer,
    fetchPostTypesCountReducer,
    fetchPostTypesReducer,
    fetchPostsReducer,
    fetchPreviewLinkReducer,
    fetchSettingsReducer,
    fetchSidebarsReducer,
    fetchTaxonomiesCountReducer,
    fetchTaxonomiesReducer,
    fetchUserMetaReducer,
    fetchWooCommerceProductDataFieldsReducer,
    fetchWooCommerceProductDataReducer,
    importFileReducer,
    metaStateReducer,
    saveCustomPostTemplateReducer,
    saveSettingsReducer,
    saveWooCommerceProductDataReducer,
    sluggifyReducer,
    stepsReducer,
    syncPostsReducer,
    userMetaStateReducer,
    WooCommerceFieldsStateReducer
};

export const configureStore = createStore(
    combineReducers(reducers),
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);