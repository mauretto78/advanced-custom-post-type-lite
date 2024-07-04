import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from "redux";
// reducers
import assocPostTypeToTaxonomy from "./reducers/assocPostTypeToTaxonomySlice";
import assocTaxonomyToPostType from "./reducers/assocTaxonomyToPostTypeSlice";
import deleteApiKey from "./reducers/deleteApiKeySlice";
import deleteDataset from "./reducers/deleteDatasetSlice";
import deleteCustomPostType from "./reducers/deleteCustomPostTypeSlice";
import deleteWooCommerceProductData from "./reducers/deleteWooCommerceProductDataSlice";
import deleteForm from "./reducers/deleteFormSlice";
import deleteMeta from "./reducers/deleteMetaSlice";
import deleteTaxonomy from "./reducers/deleteTaxonomySlice";
import deleteTemplate from "./reducers/deleteTemplateSlice";
import exportData from "./reducers/exportDataSlice";
import fetchApiKeys from "./reducers/fetchApiKeysSlice";
import fetchCustomPostTypes from "./reducers/fetchCustomPostTypesSlice";
import fetchDataset from "./reducers/fetchDatasetSlice";
import fetchDatasets from "./reducers/fetchDatasetsSlice";
import fetchForms from "./reducers/fetchFormsSlice";
import fetchFormFields from "./reducers/fetchFormFieldsSlice";
import fetchGlobalSettings from "./reducers/fetchGlobalSettingsSlice";
import fetchMeta from "./reducers/fetchMetaSlice";
import fetchOptionPages from "./reducers/fetchOptionPagesSlice";
import fetchProductDataFields from "./reducers/fetchProductDataFieldsSlice";
import fetchTaxonomies from "./reducers/fetchTaxonomiesSlice";
import fetchTemplates from "./reducers/fetchTemplatesSlice";
import fetchTemplate from "./reducers/fetchTemplateSlice";
import fetchWooCommerceProductData from "./reducers/fetchWooCommerceProductDataSlice";
import fetchLicense from "./reducers/fetchLicenseSlice";
import formManager from "./reducers/formManagerSlice";
import generateApiKey from "./reducers/generateApiKeySlice";
import importDataset from "./reducers/importDatasetSlice";
import importData from "./reducers/importDataSlice";
import datasetState from "./reducers/datasetStateSlice";
import metaState from "./reducers/metaStateSlice";
import optionPagesState from "./reducers/optionPagesStateSlice";
import productDataFieldsState from "./reducers/productDataFieldsStateSlice";
import saveCustomPostType from "./reducers/saveCustomPostTypeSlice";
import saveDataset from "./reducers/saveDatasetSlice";
import saveForm from "./reducers/saveFormSlice";
import saveFormFields from "./reducers/saveFormFieldsSlice";
import saveMeta from "./reducers/saveMetaSlice";
import saveOptionPages from "./reducers/saveOptionPagesSlice";
import saveTaxonomy from "./reducers/saveTaxonomySlice";
import saveTemplate from "./reducers/saveTemplateSlice";
import saveSettings from "./reducers/saveSettingsSlice";
import saveWooCommerceProductData from "./reducers/saveWooCommerceProductDataSlice";
import saveWooCommerceProductDataFields from "./reducers/saveWooCommerceProductDataFieldsSlice";
import syncCustomPostTypes from "./reducers/syncCustomPostTypesSlice";

const rootReducer = combineReducers({
    assocPostTypeToTaxonomy: assocPostTypeToTaxonomy,
    assocTaxonomyToPostType: assocTaxonomyToPostType,
    deleteApiKey: deleteApiKey,
    deleteDataset: deleteDataset,
    deleteCustomPostType: deleteCustomPostType,
    deleteWooCommerceProductData: deleteWooCommerceProductData,
    datasetState: datasetState,
    deleteForm: deleteForm,
    deleteMeta: deleteMeta,
    deleteTaxonomy: deleteTaxonomy,
    deleteTemplate: deleteTemplate,
    exportData: exportData,
    fetchApiKeys: fetchApiKeys,
    fetchCustomPostTypes: fetchCustomPostTypes,
    fetchDataset: fetchDataset,
    fetchDatasets: fetchDatasets,
    fetchForms: fetchForms,
    fetchFormFields: fetchFormFields,
    fetchGlobalSettings: fetchGlobalSettings,
    fetchMeta: fetchMeta,
    fetchOptionPages: fetchOptionPages,
    fetchProductDataFields: fetchProductDataFields,
    fetchTaxonomies: fetchTaxonomies,
    fetchTemplate: fetchTemplate,
    fetchTemplates: fetchTemplates,
    fetchLicense: fetchLicense,
    fetchWooCommerceProductData: fetchWooCommerceProductData,
    formManager: formManager,
    generateApiKey: generateApiKey,
    importData: importData,
    importDataset: importDataset,
    metaState: metaState,
    optionPagesState: optionPagesState,
    productDataFieldsState: productDataFieldsState,
    saveCustomPostType: saveCustomPostType,
    saveForm: saveForm,
    saveFormFields: saveFormFields,
    saveMeta: saveMeta,
    saveOptionPages: saveOptionPages,
    saveDataset: saveDataset,
    saveTaxonomy: saveTaxonomy,
    saveTemplate: saveTemplate,
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
