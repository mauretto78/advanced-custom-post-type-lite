import React, {useEffect, useState} from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import Button from "../../components/Button";
import {styleVariants} from "../../constants/styles";
import Card from "../../components/Card";
import CardRow from "../../components/Card/CardRow";
import {useForm} from "react-hook-form";
import Input from "../../components/Forms/Input";
import ReactSelect from "../../components/Forms/ReactSelect";
import {filterByLabel, filterByValue} from "../../utils/objects";
import {changeCurrentAdminMenuLink, metaTitle, refreshPage} from "../../utils/misc";
import {useDispatch, useSelector} from "react-redux";
import {saveSettings} from "../../redux/reducers/saveSettingsSlice";
import {toast} from "react-hot-toast";
import Toggle from "../../components/Forms/Toggle";
import {validateGoogleMapsApiKey} from "../../utils/validation";
import {wpAjaxRequest} from "../../utils/ajax";
import Select from "../../components/Forms/Select";
import {fontList} from "../../constants/fonts";

const Settings = () => {

    // manage global state
    const {error: saveError, success: saveSuccess, loading: saveLoading} = useSelector(state => state.saveSettings);
    const dispatch = useDispatch();

    // manage local state
    const [isFormSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        metaTitle(useTranslation("Settings page"));
        changeCurrentAdminMenuLink('#/settings');
    }, []);

    const settings = document.globals;
    const fetched = settings.settings;

    const enableCacheDefaultValue = (fetched.length > 0 && typeof filterByLabel(fetched, 'key', 'enable_cache') !== 'undefined') ? parseInt(filterByLabel(fetched, 'key', 'enable_cache').value) : 1;
    const deletePostsDefaultValue = (fetched.length > 0 && typeof filterByLabel(fetched, 'key', 'delete_posts') !== 'undefined') ? parseInt(filterByLabel(fetched, 'key', 'delete_posts').value) : 0;
    const deleteMetadataDefaultValue = (fetched.length > 0 && typeof filterByLabel(fetched, 'key', 'delete_metadata') !== 'undefined') ? parseInt(filterByLabel(fetched, 'key', 'delete_metadata').value) : 0;
    const deleteDefinitionsDefaultValue = (fetched.length > 0 && typeof filterByLabel(fetched, 'key', 'delete_tables_when_deactivate') !== 'undefined') ? parseInt(filterByLabel(fetched, 'key', 'delete_tables_when_deactivate').value) : 0;
    const perPageDefaultValue = (fetched.length > 0 && filterByLabel(fetched, 'key', 'records_per_page') !== '') ? filterByLabel(fetched, 'key', 'records_per_page').value : 20;
    const languageDefaultValue = (fetched.length > 0 && typeof filterByLabel(fetched, 'key', 'language').value !== 'undefined') ? filterByValue(settings.globals.available_languages, filterByLabel(fetched, 'key', 'language').value).value : 'en_US';
    const fontDefaultValue = (fetched.length > 0 && typeof filterByLabel(fetched, 'key', 'font').value !== 'undefined') ? filterByValue(fontList, filterByLabel(fetched, 'key', 'font').value).value : 'Inter';

    const { register, handleSubmit, formState: {errors, isValid} } = useForm({
        mode: 'all',
        defaultValues: {
            enable_cache: enableCacheDefaultValue,
            delete_metadata: deleteMetadataDefaultValue,
            delete_posts: deletePostsDefaultValue,
            delete_tables_when_deactivate: deleteDefinitionsDefaultValue,
            records_per_page: perPageDefaultValue,
            language: languageDefaultValue,
            font: fontDefaultValue,
        }
    });

    const onSubmit = (data) => {
        dispatch(saveSettings({
            records_per_page: data.records_per_page,
            enable_cache: data.enable_cache ? 1 : 0,
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
            toast.success(useTranslation("Settings saved. The browser will refresh after 5 seconds."));
            refreshPage(5000);
        }

        if(isFormSubmitted && saveError !== null){
            toast.error(saveError);
        }

        if(isFormSubmitted){
            setFormSubmitted(false);
        }
    }, [saveLoading]);

    const handleFlushCache = () => {
        wpAjaxRequest("flushCacheAction", {})
            .then(res => {
                if(res.success === true){
                    toast.success(useTranslation("Cache was successfully flushed"));
                } else {
                    toast.error(res.error);
                }
            })
            .catch(err => console.error(err))
        ;
    };

    const buttons = [
        <Button
            testId="save-settings"
            style={styleVariants.PRIMARY}
            disabled={!!(!isValid || saveLoading)}
        >
            {saveLoading ? useTranslation('Loading...') : useTranslation('Save')}
        </Button>
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Layout
                crumbs={[
                    {
                        label: useTranslation("Settings")
                    }
                ]}
                title={useTranslation("Settings")}
                actions={buttons}
            >
                <div className="flex-column s-24">
                    <Card title={useTranslation("General settings")}>
                        <CardRow
                            label={useTranslation("Language")}
                            value={
                                <Select
                                    id="language"
                                    label={useTranslation("Language")}
                                    placeholder={useTranslation("Set the language of the plug-in")}
                                    description={useTranslation("Set the language of the plug-in")}
                                    register={register}
                                    defaultValue={languageDefaultValue}
                                    values={settings.globals.available_languages}
                                    isRequired={true}
                                    errors={errors}
                                    validate={{
                                        required: "This field is mandatory"
                                    }}
                                />
                            }
                        />
                        <CardRow
                            label={useTranslation("Font")}
                            value={
                                <Select
                                    id="font"
                                    label={useTranslation("Font")}
                                    placeholder={useTranslation("Set the font of the plug-in")}
                                    description={useTranslation("Set the font of the plug-in")}
                                    register={register}
                                    defaultValue={languageDefaultValue}
                                    values={fontList}
                                    isRequired={true}
                                    errors={errors}
                                    validate={{
                                        required: "This field is mandatory"
                                    }}
                                />
                            }
                        />
                        <CardRow
                            label={useTranslation("Records per page")}
                            value={
                                <Input
                                    type="number"
                                    id="records_per_page"
                                    description={useTranslation("Set the number of records per page in your ACPT dashboards.")}
                                    register={register}
                                    errors={errors}
                                    isRequired={true}
                                    min={1}
                                    max={200}
                                    validate={{
                                        required: "This field is mandatory"
                                    }}
                                />
                            }
                        />
                    </Card>
                    <Card title={useTranslation("Performances")}>
                        <CardRow
                            label={useTranslation("Enable ACPT cache")}
                            value={
                                <Toggle
                                    id="enable_cache"
                                    description={useTranslation("Enable the ACPT cache. The cache stores the MySQL results in simple textual files to avoid useless DB calls.")}
                                    register={register}
                                    errors={errors}
                                    defaultValue={enableCacheDefaultValue}
                                />
                            }
                        />
                        {enableCacheDefaultValue ? (
                            <CardRow
                                label={useTranslation("Flush the ACPT cache")}
                                value={
                                    <Button
                                        style={styleVariants.SECONDARY}
                                        onClick={e => {
                                            e.preventDefault();
                                            handleFlushCache();
                                        }}
                                    >
                                        {useTranslation("Flush cache")}
                                    </Button>
                                }
                            />
                        ) : null}
                    </Card>
                    <Card title={useTranslation("Danger zone")}>
                        <CardRow
                            label={useTranslation("Delete ACPT definitions when deactivate the plug-in")}
                            value={
                                <Toggle
                                    id="delete_tables_when_deactivate"
                                    description={useTranslation("Delete all saved ACPT definitions when you deactivate the plug-in. This means that if you select NO when you deactivate and then reactivate the plug-in you will find all the previously saved ACPT definitions (meta fields, options etc.)")}
                                    register={register}
                                    errors={errors}
                                    defaultValue={deleteDefinitionsDefaultValue}
                                />
                            }
                        />
                        <CardRow
                            label={useTranslation("Delete posts when delete an ACPT post definition")}
                            value={
                                <Toggle
                                    id="delete_posts"
                                    description={useTranslation("   Delete posts when delete an ACPT post type definition. This means that if you select YES, when you delete an ACPT post type definition all the saved posts will be deleted")}
                                    register={register}
                                    errors={errors}
                                    defaultValue={deletePostsDefaultValue}
                                />
                            }
                        />
                        <CardRow
                            label={useTranslation("Delete metadata when delete an ACPT field")}
                            value={
                                <Toggle
                                    id="delete_metadata"
                                    description={useTranslation("Delete post metadata when deleting an ACPT field. This means that if you select YES, when you delete an ACPT meta field all the saved metadata will be deleted")}
                                    register={register}
                                    errors={errors}
                                    defaultValue={deleteMetadataDefaultValue}
                                />
                            }
                        />
                    </Card>
                </div>
            </Layout>
        </form>
    );
};

export default Settings;