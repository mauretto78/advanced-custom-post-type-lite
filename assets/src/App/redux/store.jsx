import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from "redux";
// reducers
import assocPostTypeToTaxonomy from "./reducers/assocPostTypeToTaxonomySlice";
import assocTaxonomyToPostType from "./reducers/assocTaxonomyToPostTypeSlice";
import deleteCustomPostType from "./reducers/deleteCustomPostTypeSlice";
import deleteWooCommerceProductData from "./reducers/deleteWooCommerceProductDataSlice";
import deleteMeta from "./reducers/deleteMetaSlice";
import deleteTaxonomy from "./reducers/deleteTaxonomySlice";
import fetchCustomPostTypes from "./reducers/fetchCustomPostTypesSlice";
import fetchGlobalSettings from "./reducers/fetchGlobalSettingsSlice";
import fetchMeta from "./reducers/fetchMetaSlice";
import fetchProductDataFields from "./reducers/fetchProductDataFieldsSlice";
import fetchTaxonomies from "./reducers/fetchTaxonomiesSlice";
import fetchWooCommerceProductData from "./reducers/fetchWooCommerceProductDataSlice";
import metaState from "./reducers/metaStateSlice";
import productDataFieldsState from "./reducers/productDataFieldsStateSlice";
import saveCustomPostType from "./reducers/saveCustomPostTypeSlice";
import saveMeta from "./reducers/saveMetaSlice";
import saveTaxonomy from "./reducers/saveTaxonomySlice";
import saveSettings from "./reducers/saveSettingsSlice";
import saveWooCommerceProductData from "./reducers/saveWooCommerceProductDataSlice";
import saveWooCommerceProductDataFields from "./reducers/saveWooCommerceProductDataFieldsSlice";
import syncCustomPostTypes from "./reducers/syncCustomPostTypesSlice";

const rootReducer = combineReducers({
    assocPostTypeToTaxonomy: assocPostTypeToTaxonomy,
    assocTaxonomyToPostType: assocTaxonomyToPostType,
    deleteCustomPostType: deleteCustomPostType,
    deleteWooCommerceProductData: deleteWooCommerceProductData,
    deleteMeta: deleteMeta,
    deleteTaxonomy: deleteTaxonomy,
    fetchCustomPostTypes: fetchCustomPostTypes,
    fetchGlobalSettings: fetchGlobalSettings,
    fetchMeta: fetchMeta,
    fetchProductDataFields: fetchProductDataFields,
    fetchTaxonomies: fetchTaxonomies,
    fetchWooCommerceProductData: fetchWooCommerceProductData,
    metaState: metaState,
    productDataFieldsState: productDataFieldsState,
    saveCustomPostType: saveCustomPostType,
    saveMeta: saveMeta,
    saveTaxonomy: saveTaxonomy,
    saveSettings: saveSettings,
    saveWooCommerceProductData: saveWooCommerceProductData,
    saveWooCommerceProductDataFields: saveWooCommerceProductDataFields,
    syncCustomPostTypes: syncCustomPostTypes,
});

export default configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
