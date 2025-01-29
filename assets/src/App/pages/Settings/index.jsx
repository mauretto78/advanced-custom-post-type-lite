import React, {useEffect, useState} from 'react';
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

    // manage local state
    const [isFormSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        metaTitle(useTranslation("Settings page"));
        changeCurrentAdminMenuLink('#/settings');
        flushCookieMessages();
    }, []);

    const settings = document.globals;
    const fetched = settings.settings;

    const delete_metadata = fetchSettingValue("delete_metadata", fetched, 0);
    const delete_posts = fetchSettingValue("delete_posts", fetched,0);
    const delete_tables_when_deactivate =fetchSettingValue("delete_tables_when_deactivate", fetched,0);
    const enable_cache = fetchSettingValue("enable_cache", fetched,1);
    const enable_cpt = fetchSettingValue("enable_cpt", fetched,1);
    const enable_tax = fetchSettingValue("enable_tax", fetched,1);
    const enable_meta = fetchSettingValue("enable_meta", fetched,1);
    const font = fetchSettingValue("font", fetched,'Inter');
    const language = fetchSettingValue("language", fetched,'en_US');
    const records_per_page = fetchSettingValue("records_per_page", fetched,20);

    const methods = useForm({
        mode: 'all',
        defaultValues: {
            enable_cache: enable_cache,
            enable_cpt: enable_cpt,
            enable_tax: enable_tax,
            enable_meta: enable_meta,
            delete_metadata: delete_metadata,
            delete_posts: delete_posts,
            delete_tables_when_deactivate: delete_tables_when_deactivate,
            records_per_page: records_per_page,
            language: language,
            font: font,
        }
    });

    const onSubmit = (data) => {
        dispatch(saveSettings({
            records_per_page: data.records_per_page,
            enable_cache: data.enable_cache ? 1 : 0,
            enable_cpt: data.enable_cpt ? 1 : 0,
            enable_tax: data.enable_tax ? 1 : 0,
            enable_meta: data.enable_meta ? 1 : 0,
            delete_tables_when_deactivate: data.delete_tables_when_deactivate ? 1 : 0,
            delete_posts: data.delete_posts ? 1 : 0,
            delete_metadata: data.delete_metadata ? 1 : 0,
            language: data.language ? data.language : null,
            font: data.font ? data.font : null
        }));
        setFormSubmitted(true);
    };

    useEffect(()=>{
        if(isFormSubmitted && saveSuccess){
            setCookieMessage("Settings saved.");
            refreshPage();
        }

        if(isFormSubmitted && saveError !== null){
            toast.error(saveError);
        }

        if(isFormSubmitted){
            setFormSubmitted(false);
        }
    }, [saveLoading]);

    const buttons = [
        <Button
            testId="save-settings"
            style={styleVariants.PRIMARY}
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
                    <Tabs halfMargin={true}>
                        <Tab title={useTranslation("General settings")}>
                            <GeneralSettingsTab
                                font={font}
                                language={language}
                                records_per_page={records_per_page}
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
                            <PerformancesTab enable_cache={enable_cache} />
                        </Tab>
                        <Tab style={styleVariants.DANGER} title={useTranslation("Danger zone")}>
                            <DangerZoneTab
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