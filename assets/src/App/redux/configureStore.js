import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {stepsReducer} from "./reducers/stepsReducer";
import {metaStateReducer} from "./reducers/metaStateReducer";
import {fetchMetaReducer} from "./reducers/fetchMetaReducer";
import {fetchPostTypesReducer} from "./reducers/fetchCustomPostTypesReducer";
import {deleteCustomPostTypeReducer} from "./reducers/deleteCustomPostTypeReducer";
import {fetchPostTypesCountReducer} from "./reducers/fetchCustomPostTypesCountReducer";
import {fetchSettingsReducer} from "./reducers/fetchSettingsReducer";
import {fetchInversedMetaReducer} from "./reducers/fetchInversedMetaReducer";
import {importFileReducer} from "./reducers/importFileReducer";
import {exportFileReducer} from "./reducers/exportFileReducer";
import {fetchTaxonomiesReducer} from "./reducers/fetchTaxonomiesReducer";
import {fetchTaxonomiesCountReducer} from "./reducers/fetchTaxonomiesCountReducer";
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

const reducers = {
    assocTaxonomyToPostReducer,
    deleteCustomPostTypeReducer,
    deletePostTypeTemplateReducer,
    deleteTaxonomyReducer,
    exportFileReducer,
    fetchHeadersAndFootersReducer,
    fetchPostDataReducer,
    fetchPostsReducer,
    fetchPostTypesReducer,
    fetchPostTypesCountReducer,
    fetchPostTypeTemplateReducer,
    fetchPreviewLinkReducer,
    fetchSettingsReducer,
    fetchSidebarsReducer,
    fetchInversedMetaReducer,
    fetchMetaReducer,
    fetchTaxonomiesReducer,
    fetchTaxonomiesCountReducer,
    importFileReducer,
    metaStateReducer,
    saveSettingsReducer,
    saveCustomPostTemplateReducer,
    stepsReducer
};

export const configureStore = createStore(
    combineReducers(reducers),
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);