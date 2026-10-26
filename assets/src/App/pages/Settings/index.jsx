import { useEffect, useRef } from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import Button from "../../components/Button";
import {styleVariants} from "../../constants/styles";
import {FormProvider, useForm} from "react-hook-form";
import {fetchSettingValue} from "../../utils/objects";
import {changeCurrentAdminMenuLink, metaTitle, refreshPage} from "../../utils/misc";
import {useDispatch, useSelector} from "react-redux";
import {saveSettings} from "../../redux/reducers/saveSettingsSlice";
import {toast} from "react-hot-toast";
import {flushCookieMessages, setCookieMessage} from "../../utils/cookies";
import Tab from "../../components/Tabs/Tab";
import Tabs from "../../components/Tabs";
import GeneralSettingsTab from "./Tabs/GeneralSettingsTab";
import ContentSettingsTab from "./Tabs/ContentSettingsTab";
import PerformancesTab from "./Tabs/PerformancesTab";
import DangerZoneTab from "./Tabs/DangerZoneTab";

const Settings = () => {
    // manage global state
    const {error: saveError, success: saveSuccess, loading: saveLoading} = useSelector(state => state.saveSettings);
    const dispatch = useDispatch();

    // tracks whether the previous render was mid-save, so the effect below
    // fires exactly once when a save completes (see saveLoading effect)
    const wasSaving = useRef(false);

    useEffect(() => {
        metaTitle(useTranslation("Settings page"));
        changeCurrentAdminMenuLink('#/settings');
        flushCookieMessages();
    }, []);

    const settings = document.globals;
    const fetched = settings.settings;

    const delete_metadata = !!fetchSettingValue("delete_metadata", fetched, 0);
    const delete_posts = !!fetchSettingValue("delete_posts", fetched,0);
    const delete_unused_tables = !!fetchSettingValue("delete_unused_tables", fetched,0);
    const delete_tables_when_deactivate = !!fetchSettingValue("delete_tables_when_deactivate", fetched,0);
    const enable_cache = !!fetchSettingValue("enable_cache", fetched,1);
    const enable_meta_cache = !!fetchSettingValue("enable_meta_cache", fetched,0);
    const cache_driver = fetchSettingValue("cache_driver", fetched,"files");
    const fetchedCacheConfig = fetchSettingValue("cache_config", fetched,{folder: "cache"});
    const cache_config = (fetchedCacheConfig && typeof fetchedCacheConfig === 'object') ? fetchedCacheConfig : {folder: "cache"};
    const cache_folder = fetchSettingValue("cache_folder", fetched,"");
    const enable_admin_menu = !!fetchSettingValue("enable_admin_menu",fetched, 1);
    const enable_cpt = !!fetchSettingValue("enable_cpt", fetched,1);
    const enable_tax = !!fetchSettingValue("enable_tax", fetched,1);
    const enable_meta = !!fetchSettingValue("enable_meta", fetched,1);
    const font = fetchSettingValue("font", fetched,'Inter');
    const skin = fetchSettingValue("skin", fetched,'light');
    const language = fetchSettingValue("language", fetched,'en_US');
    const records_per_page = fetchSettingValue("records_per_page", fetched,20);
    const sync_language = !!fetchSettingValue("sync_language", fetched,1);

    const methods = useForm({
        mode: 'all',
        defaultValues: {
            sync_language: sync_language,
            enable_cache: enable_cache,
            enable_meta_cache: enable_meta_cache,
            cache_driver: cache_driver,
            cache_config: cache_config,
            cache_folder: cache_folder,
            enable_admin_menu: enable_admin_menu,
            enable_cpt: enable_cpt,
            enable_tax: enable_tax,
            enable_meta: enable_meta,
            delete_metadata: delete_metadata,
            delete_posts: delete_posts,
            delete_tables_when_deactivate: delete_tables_when_deactivate,
            delete_unused_tables: delete_unused_tables,
            records_per_page: records_per_page,
            language: language,
            skin: skin,
            font: font,
        }
    });

    useEffect(() => {
        methods.trigger();
    }, []);

    const onSubmit = (data) => {
        dispatch(saveSettings({
            records_per_page: data.records_per_page,
            sync_language: data.sync_language ? 1 : 0,
            enable_admin_menu: data.enable_admin_menu ? 1 : 0,
            enable_cache: data.enable_cache ? 1 : 0,
            enable_meta_cache: data.enable_meta_cache ? 1 : 0,
            cache_driver: data.cache_driver,
            cache_config: data.cache_config,
            cache_folder: data.cache_folder ?? "",
            enable_cpt: data.enable_cpt ? 1 : 0,
            enable_tax: data.enable_tax ? 1 : 0,
            enable_meta: data.enable_meta ? 1 : 0,
            delete_unused_tables: data.delete_unused_tables ? 1 : 0,
            delete_tables_when_deactivate: data.delete_tables_when_deactivate ? 1 : 0,
            delete_posts: data.delete_posts ? 1 : 0,
            delete_metadata: data.delete_metadata ? 1 : 0,
            language: data.language ? data.language : null,
            skin: data.skin ? data.skin : null,
            font: data.font ? data.font : null
        }));
    };

    useEffect(()=>{
        // fire only on the loading->settled transition, not on mount or on
        // unrelated re-renders -- see the "saveSettingsAction assertion
        // failure" investigation for why a local "was this submit?" boolean
        // set alongside the dispatch() call is unreliable here: it lands one
        // render behind the redux state it's meant to gate.
        if(wasSaving.current && !saveLoading){
            if(saveSuccess){
                setCookieMessage("Settings saved.");
                refreshPage();
            }

            if(saveError !== null){
                toast.error(saveError);
            }
        }

        wasSaving.current = saveLoading;
    }, [saveLoading, saveSuccess, saveError]);

    const buttons = [
        <Button
            key="save-settings"
            testId="save-settings"
            style={styleVariants.PRIMARY}
            size="sm"
            icon="bx:save"
            disabled={!!(!methods.formState.isValid || saveLoading)}
        >
            {saveLoading ? useTranslation('Loading...') : useTranslation('Save')}
        </Button>
    ];

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Layout
                    crumbs={[
                        {
                            label: useTranslation("Settings")
                        }
                    ]}
                    title={useTranslation("Settings")}
                    actions={buttons}
                >
                    <Tabs
                        testId={"settings-tabs"}
                        halfMargin={true}
                        keepMounted={true}
                    >
                        <Tab title={useTranslation("General settings")}>
                            <GeneralSettingsTab
                                font={font}
                                skin={skin}
                                language={language}
                                records_per_page={records_per_page}
                                enable_admin_menu={enable_admin_menu}
                                sync_language={sync_language}
                            />
                        </Tab>
                        <Tab title={useTranslation("Content settings")}>
                           <ContentSettingsTab
                               enable_cpt={enable_cpt}
                               enable_meta={enable_meta}
                               enable_tax={enable_tax}
                           />
                        </Tab>
                        <Tab title={useTranslation("Performances")}>
                            <PerformancesTab
                                enable_cache={enable_cache}
                                enable_meta_cache={enable_meta_cache}
                                cache_driver={cache_driver}
                                cache_config={cache_config}
                                cache_folder={cache_folder}
                            />
                        </Tab>
                        <Tab style={styleVariants.DANGER} title={useTranslation("Danger zone")}>
                            <DangerZoneTab
                                delete_unused_tables={delete_unused_tables}
                                delete_tables_when_deactivate={delete_tables_when_deactivate}
                                delete_posts={delete_posts}
                                delete_metadata={delete_metadata}
                            />
                        </Tab>
                    </Tabs>
                </Layout>
            </form>
        </FormProvider>
    );
};

export default Settings;